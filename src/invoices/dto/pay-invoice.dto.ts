import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { PAYMENT_METHOD_ENUM } from 'src/common/enums/payment-method.enum';

export class PayInvoiceDto {
  @IsNumber()
  @IsPositive()
  visitId: number;

  @IsEnum(PAYMENT_METHOD_ENUM)
  paymentMethod: PAYMENT_METHOD_ENUM;

  @IsString()
  @Length(10, 10)
  employeeId: string;

  @IsString()
  @Length(10, 10)
  customerId: string;
}
