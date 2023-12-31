import { Injectable } from '@nestjs/common';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { DataSource, Repository } from 'typeorm';
import { Order } from 'src/orders-ws/entities/order.entity';
import { UnitOrder } from 'src/orders-ws/entities/unit-order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterOrder } from './entities/master-order.entity';
import { Visit } from 'src/visits-ws/entities/visit.entity';
import { Product } from 'src/products/entities/product.entity';
import { PRODUCT_STATE_ENUM } from 'src/common/enums/product-state.enum';

@Injectable()
export class MasterOrdersService {
  constructor(
    @InjectRepository(MasterOrder)
    private readonly masterOrdersRepository: Repository<MasterOrder>,

    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(UnitOrder)
    private readonly unitOrdersRepository: Repository<UnitOrder>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createMasterOrderDto: CreateMasterOrderDto) {
    const { visitId, products } = createMasterOrderDto;

    const visit = await this.visitRepository.findOne({
      where: { id: visitId },
    });
    if (!visit) {
      throw new Error('Visit not found');
    }
    const masterOrder = new MasterOrder();
    masterOrder.visit = visit;
    await this.masterOrdersRepository.save(masterOrder);

    for (const productData of products) {
      const order = new Order();
      order.product = await this.productRepository.findOne({
        where: { id: productData.productId },
      });
      order.quantity = productData.quantity;
      order.masterOrder = masterOrder;
      await this.ordersRepository.save(order);

      const unitOrders = Array.from({ length: productData.quantity }, () => {
        const unitOrder = new UnitOrder();
        unitOrder.order = order;
        unitOrder.product = order.product;
        unitOrder.productState = PRODUCT_STATE_ENUM.PREPARANDO;
        return unitOrder;
      });

      await this.unitOrdersRepository.save(unitOrders);
    }

    return masterOrder; // Retorna la MasterOrder creada con sus Orders y UnitOrders
  }

  findAll() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  findAllActive() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('visit.exit IS NULL')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  findAllPreparing() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect(
        'order.unitOrders',
        'unitOrder',
        'unitOrder.productState = :state',
        {
          state: PRODUCT_STATE_ENUM.PREPARANDO,
        },
      )
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('unitOrder.productState = :state', {
        state: PRODUCT_STATE_ENUM.PREPARANDO,
      })
      .andWhere('visit.exit IS NULL')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  findAllReady() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect(
        'order.unitOrders',
        'unitOrder',
        'unitOrder.productState = :state',
        {
          state: PRODUCT_STATE_ENUM.LISTO,
        },
      )
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('unitOrder.productState = :state', {
        state: PRODUCT_STATE_ENUM.LISTO,
      })
      .andWhere('visit.exit IS NULL')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  findAllServed() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect(
        'order.unitOrders',
        'unitOrder',
        'unitOrder.productState = :state',
        {
          state: PRODUCT_STATE_ENUM.SERVIDO,
        },
      )
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('unitOrder.productState = :state', {
        state: PRODUCT_STATE_ENUM.SERVIDO,
      })
      .andWhere('visit.exit IS NULL')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  findOne(id: number) {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('masterOrder.id = :id', { id })
      .getOne();
  }

  remove(id: number) {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return qb.delete().where('id = :id', { id }).execute();
  }
}
