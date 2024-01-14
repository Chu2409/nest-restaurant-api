import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/catetory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAllWithCategories() {
    const products = await this.categoriesRepository.find({
      relations: ['products'],
    });
    return products;
  }

  async update(id: number) {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      product.availability = !product.availability;
      await this.productsRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
