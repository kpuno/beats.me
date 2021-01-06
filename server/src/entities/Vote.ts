import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm"
import { User } from "./User"
import { Post } from "./Post"

// m to n
// many to many
// user <-> posts
// user -> join table <- posts (refer to bottom comment)
// user -> like <- posts

@Entity()
export class Vote extends BaseEntity {
  @Column({ type: "int" })
  value: number

  // based of user id foreign key
  @PrimaryColumn()
  userId: number

  @ManyToOne(() => User, (user) => user.votes)
  user: User

  @PrimaryColumn()
  postId: number

  @ManyToOne(() => Post, (post) => post.votes, {
    onDelete: "CASCADE",
  })
  post: Post
}