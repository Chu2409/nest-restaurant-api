import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PAYMENT_METHOD_ENUM } from '../../common/enums/payment-method.enum';
import { INVOICE_STATE_ENUM } from '../../common/enums/invoice-state.enum';
import { Customer } from '../../customers/entities/customer.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Visit } from '../../visits-ws/entities/visit.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'total',
    type: 'float4',
    default: 0,
  })
  total: number;

  @Column({
    name: 'state',
    type: 'enum',
    enum: INVOICE_STATE_ENUM,
    default: INVOICE_STATE_ENUM.PENDIENTE,
  })
  state: INVOICE_STATE_ENUM;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PAYMENT_METHOD_ENUM,
    default: PAYMENT_METHOD_ENUM.EFECTIVO,
  })
  paymentMethod: PAYMENT_METHOD_ENUM;

  @ManyToOne(() => Employee, (employee) => employee.invoices, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'employee_id',
  })
  employee: Employee;

  @OneToOne(() => Visit, (visit) => visit.invoice, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'visit_id',
  })
  visit: Visit;

  @ManyToOne(() => Customer, (customer) => customer.invoices, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;
}
