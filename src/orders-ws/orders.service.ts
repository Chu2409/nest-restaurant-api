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
import { ChangeProductOrderStatusDto } from './dto/change-product-order-status.dto';
import { PRODUCT_STATE_ENUM } from 'src/common/enums/product-state.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(UnitOrder)
    private readonly unitOrdersRepository: Repository<UnitOrder>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { products, visitId } = createOrderDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const queryBuilder = queryRunner.manager.createQueryBuilder();

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

      await queryRunner.commitTransaction();

      return { message: 'Order created successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatusUnitOrder(changeStatusDto: ChangeProductOrderStatusDto) {
    const unitOrder = await this.unitOrdersRepository.findOneBy({
      product: { id: changeStatusDto.productId },
      visit: { id: changeStatusDto.visitId },
      productState: PRODUCT_STATE_ENUM.PREPARANDO,
    });

    if (!unitOrder) throw new BadRequestException('Unit order not found');

    unitOrder.productState = PRODUCT_STATE_ENUM.LISTO;

    await this.unitOrdersRepository.save(unitOrder);

    return { message: 'Unit order status changed successfully' };
  }

  // async findAllActive() {
  //   const qb = this.dataSource.createQueryBuilder(Order, 'order');
  //   return qb
  //     .leftJoinAndSelect('order.visit', 'visit')
  //     .leftJoinAndSelect('order.product', 'product')
  //     .where('visit.exit IS NULL')
  //     .getMany();
  // }

  // async findOneActiveByTableId(id: number) {
  //   const qb = this.dataSource.createQueryBuilder(Order, 'order');
  //   return qb
  //     .leftJoinAndSelect('order.visit', 'visit')
  //     .leftJoinAndSelect('order.product', 'product')
  //     .where('visit.exit IS NULL')
  //     .andWhere('visit.tableId = :id', { id })
  //     .getMany();
  // }

  // update(updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }

  private handleExceptions(error: any) {
    if (error.code === '23503') throw new BadRequestException(error.detail);

    // console.log(error);
    throw new InternalServerErrorException('Unexpected error creating product');
  }

  private getUnitProducts(createOrderDto: CreateOrderDto) {
    const { products } = createOrderDto;
    const unitOrders: UnitProductOrderDto[] = [];

    products.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        unitOrders.push({
          productId: product.productId,
        });
      }
    });

    return unitOrders;
  }
}
