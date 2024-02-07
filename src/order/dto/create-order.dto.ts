import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { OrderDetailsDto } from './order-details.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderDetailsDto)
  items: OrderDetailsDto[];

  @IsNumber()
  @IsNotEmpty()
  // grand total price for all products.
  total: number;
}
