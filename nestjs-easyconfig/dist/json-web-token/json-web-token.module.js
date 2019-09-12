"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsonWebTokenModule_1;
const common_1 = require("@nestjs/common");
const json_web_token_service_1 = require("./json-web-token.service");
const jwt_1 = require("@nestjs/jwt");
let JsonWebTokenModule = JsonWebTokenModule_1 = class JsonWebTokenModule {
    static register() {
        return {
            module: JsonWebTokenModule_1,
            providers: [json_web_token_service_1.JsonWebTokenService],
            exports: [json_web_token_service_1.JsonWebTokenService],
        };
    }
};
JsonWebTokenModule = JsonWebTokenModule_1 = __decorate([
    common_1.Module({
        imports: [
            jwt_1.JwtModule.register({
                secret: 'jwtConstants.secret',
                signOptions: { expiresIn: '60s' },
            }),
        ],
        providers: [json_web_token_service_1.JsonWebTokenService],
        exports: [json_web_token_service_1.JsonWebTokenService],
    }),
    common_1.Module({})
], JsonWebTokenModule);
exports.JsonWebTokenModule = JsonWebTokenModule;
