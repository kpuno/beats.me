import express from "express"
import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import {createConnection} from "typeorm"
import { buildSchema } from "type-graphql"
import ormConfig from "./ormconfig"
import { UserResolver } from "./resolvers/user"
import Redis from "ioredis"
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"
import { COOKIE_NAME, __prod__ } from "./constants"
import { MyContext } from "./types"
import { PostResolver } from "./resolvers/post"
import { createVoteLoader } from "./utils/createVoteLoader"
import { createUserLoader } from "./utils/createUserLoader"

const main = async () => {
  await createConnection(ormConfig).then(async conn => {
    conn.runMigrations()
  })
  
  const RedisStore = connectRedis(session)
  const redis = new Redis(process.env.REDIS_URL)
  
  const app = express()
  // app.set("trust proxy", 1)
  
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // related to protecting its csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "kylepunorandomsecret",
      resave: false,
    })
  )
  
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    validate: false,
  })

  const apolloServer = new ApolloServer({ 
    schema,
    context: ({req, res}): MyContext  => ({ 
      req, 
      res, 
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
  })

  apolloServer.applyMiddleware({ 
    app,
    cors: false, 
  })
  
  app.listen(4000, () => {
    console.log("Server has started!")
  })
}

main().catch((err) => {
  console.error(err)
})