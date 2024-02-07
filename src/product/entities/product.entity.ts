import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar', length: 100 })
  productName: string;

  @Column({ type: 'int' })
  uom: number;

  @Column({ type: 'float' })
  pricePerUnit: number;

  @Column({ type: 'int' })
  inventory: number;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  updatedAt: Date;
}
