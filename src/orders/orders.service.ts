import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto, UnitProductOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { UnitOrder } from './entities/unit-order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(UnitOrder)
    private readonly unitOrdersRepository: Repository<UnitOrder>,

    private readonly dataSource: DataSource,
  ) {}

  private queryRunner = this.dataSource.createQueryRunner();

  async create(createOrderDto: CreateOrderDto) {
    const { products, visitId } = createOrderDto;

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    const queryBuilder = this.queryRunner.manager.createQueryBuilder();

    try {
      await queryBuilder
        .insert()
        .into(Order)
        .values(
          products.map((product) => {
            return {
              quantity: product.quantity,
              product: { id: product.productId },
              visit: { id: visitId },
            };
          }),
        )
        .execute();

      const unitProducts = this.getUnitProducts(createOrderDto);
      await queryBuilder
        .insert()
        .into(UnitOrder)
        .values(
          unitProducts.map((product) => {
            return {
              product: { id: product.productId },
              visit: { id: visitId },
            };
          }),
        )
        .execute();

      await this.queryRunner.commitTransaction();

      return { message: 'Order created successfully' };
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      await this.queryRunner.release();
    }
  }

  async findAll() {
    return await this.ordersRepository.find({
      relations: ['product', 'visit'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private handleExceptions(error: any) {
    if (error.code === '23503') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Unexpected error creating product');
  }

  private getUnitProducts(createOrderDto: CreateOrderDto) {
    const { products } = createOrderDto;
    const unitOrders: UnitProductOrderDto[] = [];

    products.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        unitOrders.push({
          productId: 2,
        });
      }
    });

    return unitOrders;
  }
}
