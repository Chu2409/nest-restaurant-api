import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/catetory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAllWithCategories() {
    const products = await this.categoriesRepository.find({
      relations: ['products'],
    });
    return products;
  }
}
