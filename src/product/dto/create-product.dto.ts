import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'productName must have atleast 2 characters.' })
  @MaxLength(100, { message: 'productName should not grater 100 characters.' })
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsNotEmpty()
  uom: number;

  @IsNumber()
  @IsNotEmpty()
  pricePerUnit: number;

  @IsNumber()
  @IsNotEmpty()
  inventory: number;

  createdAt?: Date = new Date();
}
