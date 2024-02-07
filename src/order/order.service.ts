import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailsEntity } from './entities/order-details.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailsEntity)
    private readonly orderDetailsRepository: Repository<OrderDetailsEntity>,
    private readonly productService: ProductService,
  ) {}

  async bookOrder(
    createOrderDto: CreateOrderDto,
    userName: string,
  ): Promise<any> {
    const orderEntitybject = {
      userName,
      total: createOrderDto.total,
      dateTime: new Date(),
    };
    const productIds: number[] = createOrderDto.items.map((e) => e.productId);
    const isValid: boolean =
      await this.productService.isValidateProductIds(productIds);
    if (!isValid) {
      throw new BadRequestException(
        'Product Ids are invalid. Please validate.',
      );
    }
    await this.productService.manageInventory(createOrderDto.items, productIds);
    const orderEntityRes = await this.orderRepository.save(orderEntitybject);
    if (orderEntityRes?.orderId) {
      const orderDetailsList = [];
      for (const item of createOrderDto.items) {
        orderDetailsList.push({
          orderId: orderEntityRes.orderId,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        });
      }
      await this.orderDetailsRepository.save(orderDetailsList);
    }
    return {
      orderId: orderEntityRes.orderId,
      dateTime: orderEntityRes.dateTime,
    };
  }
}
