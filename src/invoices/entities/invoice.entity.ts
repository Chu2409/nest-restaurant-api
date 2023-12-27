import { PAYMENT_METHOD_ENUM } from 'src/common/enums/payment-method.enum';
import { INVOICE_STATE_ENUM } from '../../common/enums/invoice-state.enum';
import { Employee } from '../../employees/entities/employee.entity';
import { Visit } from '../../visits/entities/visit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'total',
    type: 'numeric',
    precision: 6,
    scale: 2,
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
  })
  @JoinColumn({
    name: 'employee_id',
  })
  employee: Employee;

  @ManyToOne(() => Visit, (visit) => visit.invoices, { nullable: false })
  @JoinColumn({
    name: 'visit_id',
  })
  visit: Visit;
}
