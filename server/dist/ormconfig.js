"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "postgres",
    database: "beatsme",
    username: "kylepuno",
    entities: [__dirname + "/entities/**/*{.ts,.js}"],
    migrations: [__dirname + "/migration/**/*{.ts,.js}"],
    synchronize: false
};
//# sourceMappingURL=ormconfig.js.map