"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtRefreshGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtRefreshGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
}
exports.JwtRefreshGuard = JwtRefreshGuard;
//# sourceMappingURL=jwt-refresh.guard.js.map