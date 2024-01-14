import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  ProductsCountByMonthDto,
  ProductsCountByYearDto,
} from './dto/products-count-report.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('get-products-count-by-month')
  async getProductsCountByMonth(
    @Body() productsCountByMonthDto: ProductsCountByMonthDto,
  ) {
    return await this.ordersService.getProductsCountByMonth(
      productsCountByMonthDto,
    );
  }

  @Post('get-products-count-by-year')
  async getProductsCountByYear(
    @Body() productsCountByYearDto: ProductsCountByYearDto,
  ) {
    return await this.ordersService.getProductsCountByYear(
      productsCountByYearDto,
    );
  }
}
