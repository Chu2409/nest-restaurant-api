import { IsNumber, IsPositive } from 'class-validator';

export class CreateVisitDto {
  @IsNumber()
  @IsPositive()
  tableId: number;
}
