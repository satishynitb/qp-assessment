import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { envConst } from 'src/env.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // If true, do not validate the expiration of the token.
      ignoreExpiration: false,
      secretOrKey: configService.get(envConst.JWT_SECRET),
    });
  }

  async validate(payload) {
    return {
      userId: payload.id,
      userName: payload.userName,
      role: payload.role,
    };
  }
}
