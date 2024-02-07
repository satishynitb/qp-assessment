import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.authguard';
import { RoleGuard } from './role/role.guard';
import { LoginResponse } from './interface/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  login(@Body() authenticateDto: AuthenticateDto): LoginResponse {
    try {
      const data = this.authService.authenticate(authenticateDto);
      return { data };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/info')
  profile(@Res() res, @Req() req) {
    return res.status(HttpStatus.OK).json(req.user);
  }
}
