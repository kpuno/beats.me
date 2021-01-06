import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { ObjectType, Field, ID, Int } from "type-graphql"
import { User } from "./User"
// import { Beat } from "./Beat"
import { Vote } from "./Vote"
import { Beat } from "./Beat"

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => String)
  @Column()
  image: string // url to image

  @Field()
  @Column()
  creatorId: number

  @Field(() => String)
  @Column()
  creator!: string

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

  @ManyToOne(() => User, user => user.posts)
  user: User

  @Field(() => String)
  @Column()
  description: string

  // post can have a song which is an entire beat
  // post can have multiple beat sample
  // TODO: multiple beats in one post to compose a sample for a song (verse,hook,bridge)
  // @OneToMany(() => Beat, beat => beat.post)
  // beats: Beat[]

  @Field(() => Beat)
  beats: Beat[] // one beat for now per post

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];
}