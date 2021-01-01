import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, BaseEntity } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string

  @CreateDateColumn()
  createdAt: Date

  @CreateDateColumn()
  updatedAt: Date

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
}