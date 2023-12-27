import { Order } from '../../orders/entities/order.entity';
import { UnitOrder } from '../../orders/entities/unit-order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Category } from './catetory.entity';

@Entity('products')
export class Product {
  @PrimaryColumn({
    name: 'id',
    type: 'smallint',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: '100',
  })
  name: string;

  @Column({
    name: 'price',
    type: 'float4',
  })
  price: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  @Column({
    name: 'availability',
    type: 'boolean',
  })
  availability: boolean;

  @OneToMany(() => Order, (order) => order.product)
  orders?: Order[];

  @OneToMany(() => UnitOrder, (unitOrder) => unitOrder.product)
  unitOrders?: UnitOrder[];
}
