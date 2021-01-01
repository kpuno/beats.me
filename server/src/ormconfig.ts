import { ConnectionOptions } from "typeorm";

export default {
  type: "postgres",
  database: "beatsme",
  username: "kylepuno",
  entities: [ __dirname  + "/entities/**/*{.ts,.js}"],
  migrations: [ __dirname + "/migration/**/*{.ts,.js}"],
  synchronize: false // add prod stuff here after
} as ConnectionOptions