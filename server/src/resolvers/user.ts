import { User } from "../entities/User"
import { Resolver, Query, Mutation, InputType, Arg, Field, ObjectType, Ctx } from "type-graphql"
import argon2 from "argon2"
import { getRepository } from "typeorm"
import { MyContext } from "../types"
import { sendEmail } from "../utils/sendEmail"
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants"
import { v4 } from "uuid"

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

  // find username includes (as user is typing)
  // TODO: refactor out valiation

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() {redis, req}: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [{
          field: 'newPassword',
          message: 'Length must be greater than 2'
        }]
      }
    }

    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token expired'
          }
        ]
      }
    }

    const userIdNum = parseInt(userId)
    const user = await this.userRepository.findOne({id: userIdNum.toString() })

    if(!user ) {
      return {
        errors: [
          {
            field: 'token',
            message: 'User no longer exists'
          }
        ]
      }
    }

    const hashedPassword = await argon2.hash(newPassword)
    user.password = hashedPassword

    await this.userRepository.save(user)

    await redis.del(key)
    // login user after change password
    req.session!.userId = parseInt(user.id)

    return { user }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

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
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    console.log(usernameOrEmail, password)
    const user = await this.userRepository.findOne(
      usernameOrEmail.includes('@') ? 
        { email: usernameOrEmail } : { username: usernameOrEmail }
    )

    if (usernameOrEmail.length < 2) {
      return {
          errors: [{
          field: "usernameOrEmail",
          message: "Invalid username",
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

  @Mutation(() => UserResponse) 
  async register (
    @Arg("options") options: InputRegister,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { username, email, password } = options
    // check duplicate email usernames
    let user = await this.userRepository.findOne({
      where: [{ email }, { username }]
    })
    console.log(user)
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

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session!.userId = parseInt(user.id)

    return { user }
  }
  
  // find all users
  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userRepository.find({})
  }
}