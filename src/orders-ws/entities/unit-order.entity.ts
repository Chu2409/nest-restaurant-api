import { PRODUCT_STATE_ENUM } from '../../common/enums/product-state.enum';
import { Product } from '../../products/entities/product.entity';
import { Visit } from '../../visits-ws/entities/visit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('unit_orders')
export class UnitOrder {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'product_state',
    type: 'enum',
    enum: PRODUCT_STATE_ENUM,
    default: PRODUCT_STATE_ENUM.PREPARANDO,
  })
  productState: PRODUCT_STATE_ENUM;

  @Column({
    name: 'queued_at',
    type: 'timestamp',
    nullable: true,
  })
  queuedAt?: Date;

  @ManyToOne(() => Product, (product) => product.orders, {
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Visit, (visit) => visit.unitOrders, { nullable: false })
  @JoinColumn({
    name: 'visit_id',
  })
  visit: Visit;
}
