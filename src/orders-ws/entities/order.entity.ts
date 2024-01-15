import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterOrder } from '../../master-orders/entities/master-order.entity';
import { Product } from '../../products/entities/product.entity';
import { UnitOrder } from './unit-order.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'quantity',
    type: 'smallint',
  })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orders, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @Column({
    name: 'queued_at',
    type: 'timestamp',
    nullable: false,
  })
  queuedAt: Date;

  @ManyToOne(() => MasterOrder, (masterOrder) => masterOrder.orders, {
    nullable: false,
  })
  @JoinColumn({
    name: 'master_order_id',
  })
  masterOrder: MasterOrder;

  @OneToMany(() => UnitOrder, (unitOrder) => unitOrder.order)
  unitOrders?: UnitOrder[];
}
