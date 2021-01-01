"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const ormconfig_1 = __importDefault(require("./ormconfig"));
const user_1 = require("./resolvers/user");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    yield typeorm_1.createConnection(ormconfig_1.default).then((conn) => __awaiter(void 0, void 0, void 0, function* () {
        conn.runMigrations();
    }));
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [user_1.UserResolver]
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({ schema });
    apolloServer.applyMiddleware({ app });
    yield app.listen(4000);
    console.log("Server has started!");
});
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map