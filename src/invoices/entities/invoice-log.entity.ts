import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('invoices_log')
export class InvoiceLog {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'total',
    type: 'float4',
  })
  total: number;

  @Column({
    name: 'employee_id',
    type: 'varchar',
    length: '10',
  })
  employeeId: string;

  @Column({
    name: 'invoice_id',
    type: 'int',
  })
  invoiceId: number;

  @Column({
    name: 'customer_id',
    type: 'varchar',
    length: '10',
  })
  customerId: string;

  @Column({
    name: 'date',
    type: 'timestamp without time zone',
  })
  date!: Timestamp;
}
