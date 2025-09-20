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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let WsJwtGuard = class WsJwtGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = this.extractToken(client);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing authentication token');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            client.data = client.data || {};
            client.data.user = payload;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    extractToken(client) {
        const authToken = client.handshake?.auth?.token;
        if (typeof authToken === 'string' && authToken.trim()) {
            return authToken;
        }
        const authHeader = client.handshake?.headers?.authorization;
        if (typeof authHeader === 'string') {
            const [, bearerToken] = authHeader.split(' ');
            if (bearerToken) {
                return bearerToken;
            }
        }
        const cookieHeader = client.handshake?.headers?.cookie;
        if (cookieHeader) {
            const parsed = Object.fromEntries(cookieHeader.split(';').map((part) => {
                const [key, ...rest] = part.trim().split('=');
                return [key, decodeURIComponent(rest.join('='))];
            }));
            if (parsed.qtp_access_token) {
                return parsed.qtp_access_token;
            }
        }
        return null;
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WsJwtGuard);
//# sourceMappingURL=ws-jwt.guard.js.map