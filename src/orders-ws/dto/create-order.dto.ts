import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { PRODUCT_STATE_ENUM } from '../../common/enums/product-state.enum';

export class CreateOrderDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  visitId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];
}

export class ProductOrderDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  productId: number;
}

export class UnitProductOrderDto {
  @IsEnum(PRODUCT_STATE_ENUM)
  @IsOptional()
  productState?: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  productId: number;
}
