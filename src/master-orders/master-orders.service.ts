import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PRODUCT_STATE_ENUM } from '../common/enums/product-state.enum';
import { MasterOrder } from './entities/master-order.entity';
import { Order } from '../orders-ws/entities/order.entity';
import { UnitOrder } from '../orders-ws/entities/unit-order.entity';
import { Visit } from '../visits-ws/entities/visit.entity';
import { Product } from '../products/entities/product.entity';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';

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
      order.queuedAt = new Date();
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

  async findAll() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return await qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();
  }

  async findAllActive() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    const r = await qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .leftJoinAndSelect('visit.masterOrders', 'masterOrders')
      .where('visit.exit IS NULL')
      .orderBy('masterOrder.createdAt', 'ASC')
      .getMany();

    return r;
  }

  async findAllPreparing() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    const r = await qb
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
    return r;
  }

  async findAllReady() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return await qb
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

  async findAllServed() {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return await qb
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

  async findOne(id: number) {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return await qb
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('masterOrder.visit', 'visit')
      .leftJoinAndSelect('visit.table', 'table')
      .where('masterOrder.id = :id', { id })
      .getOne();
  }

  async remove(id: number) {
    const qb = this.dataSource.createQueryBuilder(MasterOrder, 'masterOrder');
    return await qb.delete().where('id = :id', { id }).execute();
  }
}
