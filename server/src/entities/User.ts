import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, BaseEntity, UpdateDateColumn, OneToMany } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Post } from "./Post"
import { Vote } from "./Vote"

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => String)
  @Column({ nullable: true })
  avatar: string // url to image

  @Field(() => String)
  @Index({ unique: true })
  @Column()
  username!: string

  @Field(() => String)  
  @Index({ unique: true })
  @Column()
  email!: string

  @Field(() => String)
  @Index({ unique: true })
  @Column()
  password!: string

  @OneToMany(() => Post, post => post.creator)
  posts: Post[]

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[]
}