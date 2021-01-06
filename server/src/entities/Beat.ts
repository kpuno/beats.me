// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, UpdateDateColumn, ManyToOne } from "typeorm"
// import { ObjectType, Field, ID } from "type-graphql"
// import { Post } from "./Post"

// @Entity()
// @ObjectType()
// export class Beat extends BaseEntity {
//   @Field(() => ID)
//   @PrimaryGeneratedColumn()
//   id: number

//   @CreateDateColumn()
//   createdAt: Date

//   @UpdateDateColumn()
//   updatedAt: Date

//   @Field(() => String)
//   @Column()
//   creator!: string

//   @ManyToOne(() => Post, post => post.beats)
//   post: Post

//   @Field(() => String)
//   @Column()
//   beat: string // url to beat
// }