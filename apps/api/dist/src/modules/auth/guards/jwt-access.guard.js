"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAccessGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtAccessGuard extends (0, passport_1.AuthGuard)('jwt') {
}
exports.JwtAccessGuard = JwtAccessGuard;
//# sourceMappingURL=jwt-access.guard.js.map