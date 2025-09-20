import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

function cookieExtractor(req: any) {
  if (req && req.cookies && req.cookies['refresh_token']) {
    return req.cookies['refresh_token'];
  }
  return null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'
    });
  }
  async validate(payload: any) {
    if (!payload?.sub) throw new UnauthorizedException();
    return payload;
  }
}

