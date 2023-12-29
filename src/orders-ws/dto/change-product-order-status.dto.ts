import { IsNumber, IsPositive } from 'class-validator';

export class ChangeProductOrderStatusDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  visitId: number;
}
