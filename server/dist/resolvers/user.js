"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
let InputRegister = class InputRegister {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], InputRegister.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], InputRegister.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], InputRegister.prototype, "password", void 0);
InputRegister = __decorate([
    type_graphql_1.InputType()
], InputRegister);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    constructor() {
        this.userRepository = typeorm_1.getRepository(User_1.User);
    }
    user(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ username });
            if (!user) {
                return {
                    errors: [{
                            field: "user",
                            message: "User does not exist",
                        }]
                };
            }
            return { user };
        });
    }
    login(usernameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne(usernameOrEmail.includes('@') ?
                { email: usernameOrEmail } : { username: usernameOrEmail });
            if (!user) {
                return {
                    errors: [{
                            field: "password",
                            message: "Incorrect credentials, please try again",
                        }]
                };
            }
            try {
                if (yield argon2_1.default.verify(user.password, password)) {
                    return { user };
                }
                else {
                    return {
                        errors: [{
                                field: "password",
                                message: "Incorrect credentials, please try again",
                            }]
                    };
                }
            }
            catch (err) {
                return {
                    errors: [{
                            field: "password",
                            message: "Internal Error: " + err.code,
                        }]
                };
            }
        });
    }
    register({ username, email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (username.length < 2) {
            }
            if (!email.includes('@')) {
            }
            if (password.length < 2) {
            }
            const hashedPassword = yield argon2_1.default.hash(password);
            const user = User_1.User.create({ username, email, password: hashedPassword });
            yield this.userRepository.save(user);
            console.log(user);
            return user;
        });
    }
    users() {
        return this.userRepository.find({});
    }
};
__decorate([
    type_graphql_1.Query(() => UserResponse),
    __param(0, type_graphql_1.Arg("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], UserResolver.prototype, "user", null);
__decorate([
    type_graphql_1.Query(() => UserResponse),
    __param(0, type_graphql_1.Arg("usernameOrEmail")),
    __param(1, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg("options")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InputRegister]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], UserResolver.prototype, "users", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map