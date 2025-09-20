import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractToken(client);
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data = client.data || {};
      client.data.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(client: Socket): string | null {
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
      const parsed = Object.fromEntries(
        cookieHeader.split(';').map((part) => {
          const [key, ...rest] = part.trim().split('=');
          return [key, decodeURIComponent(rest.join('='))];
        })
      );
      if (parsed.qtp_access_token) {
        return parsed.qtp_access_token;
      }
    }

    return null;
  }
}
