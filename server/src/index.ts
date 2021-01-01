import express from "express"
import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import {createConnection} from "typeorm"
import { buildSchema } from "type-graphql"
import ormConfig from "./ormconfig"
import { UserResolver } from "./resolvers/user"

const main = async () => {
  const app = express()
  
  await createConnection(ormConfig).then(async conn => {
    conn.runMigrations()
  })
  
  const schema = await buildSchema({
    resolvers: [UserResolver]
  })

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })
  
  await app.listen(4000)
  console.log("Server has started!")
}

main().catch((err) => {
  console.error(err)
})