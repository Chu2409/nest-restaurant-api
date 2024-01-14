import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAllWithCategories() {
    return this.productsService.findAllWithCategories();
  }

  @Patch(':id')
  update(@Param('id') id: number) {
    return this.productsService.update(id);
  }
}
