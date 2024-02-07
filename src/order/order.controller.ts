import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/jwt.authguard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async bookOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const data = await this.orderService.bookOrder(
      createOrderDto,
      req.user.userName,
    );
    return { data };
  }
}
