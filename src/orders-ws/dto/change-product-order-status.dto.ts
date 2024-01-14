import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PRODUCT_STATE_ENUM } from '../../common/enums/product-state.enum';

export class ChangeProductOrderStatusDto {
  @IsNumber()
  @IsPositive()
  unitOrderId: number;

  @IsEnum(PRODUCT_STATE_ENUM)
  state: PRODUCT_STATE_ENUM;
}
