import { Invoice } from '../../invoices/entities/invoice.entity';
import { Order } from '../../orders-ws/entities/order.entity';
import { UnitOrder } from '../../orders-ws/entities/unit-order.entity';
import { Table } from 'src/tables-ws/entities/table.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'entry',
    type: 'timestamp',
  })
  entry: Date;

  @Column({
    name: 'exit',
    type: 'timestamp',
    nullable: true,
  })
  exit?: Date;

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
