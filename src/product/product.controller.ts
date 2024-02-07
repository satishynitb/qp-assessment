import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/role/role.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createProdct(@Body() createAdminDto: CreateProductDto) {
    const data = await this.productService.createProdct(createAdminDto);
    return { data };
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async findAllProduct() {
    const data = await this.productService.findAllProduct();
    return { data };
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateDto: UpdateProductDto,
  ) {
    const data = await this.productService.updateProduct(+productId, updateDto);
    return { data };
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':productId')
  async removeProduct(@Param('productId') productId: string) {
    const data = await this.productService.removeProduct(+productId);
    return { data: { deletedRow: data.affected } };
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/available')
  async viewAvailableProduct() {
    const data = await this.productService.viewAvailableProduct();
    return { data };
  }
}
