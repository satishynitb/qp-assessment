import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity()
export class OrderDetailsEntity {
  @ManyToOne(() => OrderEntity, (o: OrderEntity) => o.orderId, {
    nullable: false,
  })
  @JoinColumn({ name: 'orderId' })
  @PrimaryColumn()
  orderId: OrderEntity;

  @ManyToOne(() => ProductEntity, (p: ProductEntity) => p.productId, {
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  @PrimaryColumn()
  productId: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;

  // total price for each product * number of qauantity
  @Column({ type: 'float' })
  totalPrice: number;
}
