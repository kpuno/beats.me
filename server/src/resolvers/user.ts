import { User } from "../entities/User"
import { Resolver, Query, Mutation, InputType, Arg, Field, ObjectType } from "type-graphql"
import argon2 from "argon2"
import { getRepository } from "typeorm"

@InputType()
class InputRegister {
  @Field()
  username: string

  @Field()
  email: string

  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {

  private userRepository = getRepository(User)

  // find 1 user
  @Query(() => UserResponse)
  async user(
    @Arg("username") username: string
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ username })
    
    if (!user) {
      return {
        errors: [{
          field: "user",
          message: "User does not exist",
        }]
      }
    }

    return { user }
  }
  
  // login user
  @Query(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne(
      usernameOrEmail.includes('@') ? 
        { email: usernameOrEmail } : { username: usernameOrEmail }
    )

    if (!user) {
      return {
        errors: [{
          field: "password",
          message: "Incorrect credentials, please try again",
        }]
      }
    }

    try {
      if (await argon2.verify(user!.password, password)) {
        return { user }
      } else {
        return {
          errors: [{
            field: "password",
            message: "Incorrect credentials, please try again",
          }]
        }
      }
    } catch (err) {
      return {
        errors: [{
          field: "password",
          message: "Internal Error: " + err.code,
        }]
      }
    }
  }


  // logout user
  // change password
  // find username includes (as user is typing)

  @Mutation(() => User) 
  async register (
    @Arg("options") { username, email, password }: InputRegister
  ): Promise<User> {
    if (username.length < 2) {

    }

    if (!email.includes('@')) {

    }

    if (password.length < 2) {

    }

    const hashedPassword = await argon2.hash(password)
    const user = User.create({ username, email, password: hashedPassword })
    
    await this.userRepository.save(user)
    
    console.log(user)

    return user
  }
  
  // find all users
  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userRepository.find({})
  }
}