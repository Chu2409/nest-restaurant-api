import { PRODUCT_STATE_ENUM } from '../../common/enums/product-state.enum';
import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('unit_orders')
export class UnitOrder {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @ManyToOne(() => Product, (product) => product.orders, {
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @Column({
    name: 'product_state',
    type: 'enum',
    enum: PRODUCT_STATE_ENUM,
    default: PRODUCT_STATE_ENUM.PREPARANDO,
  })
  productState: PRODUCT_STATE_ENUM;

  @ManyToOne(() => Order, (order) => order.unitOrders, { nullable: false })
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;
}
