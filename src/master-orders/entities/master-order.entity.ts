import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders-ws/entities/order.entity';
import { Visit } from '../../visits-ws/entities/visit.entity';

@Entity('master_orders')
export class MasterOrder {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @ManyToOne(() => Visit, (visit) => visit.masterOrders, {
    nullable: false,
  })
  @JoinColumn({
    name: 'visit_id',
  })
  visit: Visit;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.masterOrder, { eager: true })
  orders?: Order[];
}
