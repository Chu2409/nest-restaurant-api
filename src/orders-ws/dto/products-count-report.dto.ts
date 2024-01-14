import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Product } from '../../products/entities/product.entity';

export class ProductsCountByMonthDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @IsPositive()
  @Min(2020)
  @Max(2030)
  year: number;
}

export class ProductsCountByYearDto {
  @IsNumber()
  @IsPositive()
  @Min(2020)
  @Max(2030)
  year: number;
}

export interface ProductsCountResponse {
  [productName: string]: number;
}

export const getProductsBase = (products: Product[]): ProductsCountResponse => {
  const productsCount: ProductsCountResponse = {};

  products.forEach((product) => {
    productsCount[product.name] = 0;
  });

  return productsCount;
};
