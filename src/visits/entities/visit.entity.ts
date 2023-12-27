import { Customer } from '../../customers/entities/customer.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { Order } from '../../orders/entities/order.entity';
import { UnitOrder } from '../../orders/entities/unit-order.entity';
import { Table } from '../../tables/entities/table.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'entry',
    type: 'timestamp without time zone',
  })
  entry: Timestamp;

  @Column({
    name: 'exit',
    type: 'timestamp without time zone',
    nullable: true,
  })
  exit?: Timestamp;

  @ManyToOne(() => Customer, (customer) => customer.visits, {
    nullable: true,
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer?: Customer;

  @ManyToOne(() => Table, (table) => table.visits, {
    nullable: false,
  })
  @JoinColumn({
    name: 'table_id',
  })
  table: Table;

  @OneToMany(() => Order, (order) => order.visit)
  orders?: Order[];

  @OneToMany(() => UnitOrder, (unitOrder) => unitOrder.visit)
  unitOrders?: UnitOrder[];

  @OneToMany(() => Invoice, (invoice) => invoice.visit)
  invoices?: Invoice[];
}
