import { BadRequestException, Injectable } from '@nestjs/common';
import { Token } from './interface/token.interface';
import { faker } from '@faker-js/faker';
import { AuthenticateDto } from './dto/authenticate.dto';
import { sign } from 'jsonwebtoken';
import { Role } from './role/role.enum';
import { ConfigService } from '@nestjs/config';
import { envConst } from 'src/env.const';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}
  users = [
    {
      id: faker.string.uuid(),
      userName: 'admin',
      password: 'admin@123',
      role: Role.Admin,
    },
    {
      id: faker.string.uuid(),
      userName: 'user',
      password: 'user@123',
      role: Role.User,
    },
  ];

  /**
   *
   * @param authenticateDto
   * @returns
   */
  authenticate(authenticateDto: AuthenticateDto): Token {
    const user = this.users.find((u) => {
      return (
        u.userName === authenticateDto.userName &&
        u.password === authenticateDto.password
      );
    });
    if (!user)
      throw new BadRequestException('Either userName or password invalid.');
    const secret = this.configService.get(envConst.JWT_SECRET);
    const expiresIn = this.configService.get(envConst.JWT_EXPIRES_IN);
    const token = sign({ ...user }, secret, { expiresIn });
    return { token };
  }
}
