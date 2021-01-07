import { Entity, Column, CreateDateColumn, BaseEntity, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Post } from "./Post"

@Entity()
@ObjectType()
export class Beat extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number
  
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => String)
  @Column()
  label: string

  // based of user id foreign key
  @Field()
  @Column()
  userId: number

  @Field()
  @Column()
  postId: number

  @ManyToOne(() => Post, (post) => post.beats, {
    onDelete: "CASCADE",
  })
  post: Post

  // might need a dataloader for beats
  @Field(() => String)
  @Column()
  beat: string // url to beat
}