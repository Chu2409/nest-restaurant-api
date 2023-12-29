import { Product } from '../../products/entities/product.entity';
import { Visit } from '../../visits-ws/entities/visit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Visit, (visit) => visit.orders, { nullable: false })
  @JoinColumn({
    name: 'visit_id',
  })
  visit: Visit;
}
