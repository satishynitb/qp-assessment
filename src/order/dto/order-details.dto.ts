import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class OrderDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  // total price for each product * number of qauantity
  totalPrice: number;
}
