import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column({ type: 'varchar', length: 30 })
  userName: string;

  // grand total price for all products.
  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'date' })
  dateTime: Date;
}
