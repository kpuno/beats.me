import { User } from "../entities/User"
import { Resolver, Query, Mutation, InputType, Arg, Field, ObjectType, Ctx } from "type-graphql"
import argon2 from "argon2"
import { getRepository } from "typeorm"
import { MyContext } from "../types"
import { COOKIE_NAME } from "../constants"

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

  @Query(() => User, {nullable: true})
  async me (
    @Ctx() { req }: MyContext
  ) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }

    const user = await this.userRepository.findOne({ id: req.session.userId.toString() })
    
    return user
  }

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
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
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
    } else 

    try {
      if (await argon2.verify(user!.password, password)) {
        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session!.userId = parseInt(user.id)
        
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
  @Mutation(() => Boolean)
  logout(
    @Ctx() {req, res}: MyContext
  ) {
    return  new Promise(resolve => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME)
      if (err) {
        console.log(err)
        resolve(false)
        return
      } 
      resolve(true)
    }))
  }
  
  // change password
  // find username includes (as user is typing)
  // redis caching
  // login  user when created

  @Mutation(() => User) 
  async register (
    @Arg("options") { username, email, password }: InputRegister
  ): Promise<UserResponse> {

    // check duplicate email username
    let user = await this.userRepository.findOne({
      where: { $or: [{ email }, { username }] }
    })
    
    if (user) {
      return {
        errors: [{
        field: "username",
        message: "Username or email already exists",
      }]
    }
    }

    if (username.length < 2) {
      return {
          errors: [{
          field: "username",
          message: "Invalid username",
        }]
      }
    }

    if (!email.includes('@')) {
      return {
          errors: [{
          field: "email",
          message: "Invalid email",
        }]
      }
    }

    if (password.length < 2) {
      return {
          errors: [{
          field: "password",
          message: "Invalid password",
        }]
      }
    }

    const hashedPassword = await argon2.hash(password)
    user = User.create({ username, email, password: hashedPassword })
    
    await this.userRepository.save(user)

    return { user }
  }
  
  // find all users
  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userRepository.find({})
  }
}