import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { getConnection } from "typeorm"
import { Post } from "../entities/Post"
import { Vote } from "../entities/Vote"
import { User } from "../entities/User"
import { isAuth } from "../middleware/isAuth"
import { MyContext } from "../types"
import { Beat } from "../entities/Beat"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

@InputType()
class PostInput {
  @Field()
  description: string
  
  @Field()
  image: string
}

@InputType()
class BeatInput {
  @Field()
  label: string

  @Field()
  beat: string
}

@Resolver(Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }
 
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Arg("beatsInput", () => [BeatInput]) beatsInput: BeatInput[],
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    // FIXME: can be done in a better way
    let createdPost = await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save()

    let beats = beatsInput.map((b) => {
      return {
        beat: b.beat,
        label: b.label,
        userId: req.session.userId,
        postId: createdPost.id
      } as QueryDeepPartialEntity<Beat>
     })

     await getConnection()
     .createQueryBuilder()
     .insert()
     .into(Beat)
     .values([...beats])
     .execute()

    // return a join table

    return await createdPost
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("description") description: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ description })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute()

    return result.raw[0]
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    
    await Post.delete({ id, creatorId: req.session.userId })
    return true
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { voteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const vote = await voteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return vote ? vote.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isVote = value !== -1;
    const realValue = isVote ? 1 : -1;
    const { userId } = req.session;

    const vote = await Vote.findOne({ where: { postId, userId } });

    // the user has voted on the post before
    // and they are changing their vote
    if (vote && vote.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    update vote
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!vote) {
      // has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    insert into vote ("userId", "postId", value)
    values ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
    update post
    set points = points + $1
    where id = $2
      `,
          [realValue, postId]
        );
      });
    }
    return true;
  }
}