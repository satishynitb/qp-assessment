import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailsEntity } from './entities/order-details.entity';
import { ProductService } from '../product/product.service';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly productService: ProductService,
    private dataSource: DataSource
  ) { }

/**
 * It will book the order.
 * @param createOrderDto 
 * @param userName 
 * @returns object { orderId, dateTime }
 */
  async bookOrder(
    createOrderDto: CreateOrderDto,
    userName: string,
  ): Promise<object> {
    const response: any = {};
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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
      const records:any = await this.manageInventory(createOrderDto.items, productIds, queryRunner);
      await queryRunner.manager.save(ProductEntity, records);
      const orderEntityRes = await queryRunner.manager.save(OrderEntity, orderEntitybject);
      const orderDetailsList = [];
      for (const item of createOrderDto.items) {
        orderDetailsList.push({
          orderId: orderEntityRes?.orderId,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        });
      }
      await queryRunner.manager.save(OrderDetailsEntity, orderDetailsList);
      await queryRunner.commitTransaction();
      response.orderId = orderEntityRes.orderId;
      response.dateTime = orderEntityRes.dateTime;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return response;
  }

  /**
   * It will manage grocery item inventory.
   * @param items 
   * @param productIds 
   * @param queryRunner 
   * @returns ProductEntity[]
   */
  private async manageInventory(items: object[], productIds: number[], queryRunner): Promise<ProductEntity[]> {
    let records = await queryRunner.manager.findBy(ProductEntity, {
      productId: In(productIds),
    });
    records = records.map((v) => {
      const item: any = items.find((e: any) => e.productId === v.productId);
      v.inventory = v.inventory - item.quantity;
      if (v.inventory < 0) {
        throw new BadRequestException(
          `productId: ${item.productId}, Inventory not available for ${item.quantity} quantity, available quantity is ${v.inventory + item.quantity}`,
        );
      }
      return v;
    });
    return records;
  }
}
