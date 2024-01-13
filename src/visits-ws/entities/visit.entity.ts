import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { MasterOrder } from '../../master-orders/entities/master-order.entity';
import { Table } from '../../tables-ws/entities/table.entity';

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

  @OneToMany(() => MasterOrder, (masterOders) => masterOders.visit)
  masterOrders?: MasterOrder[];

  @OneToOne(() => Invoice, (invoice) => invoice.visit, { nullable: true })
  @JoinColumn({
    name: 'invoice_id',
  })
  invoice?: Invoice;
}
