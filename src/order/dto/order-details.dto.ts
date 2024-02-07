import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  // total price for each product * number of qauantity
  totalPrice: number;
}
