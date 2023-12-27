import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders-log')
export class OrderLog {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: '100',
  })
  productName: string;

  @Column({
    name: 'product_price',
    type: 'float4',
  })
  productPrice: number;

  @Column({
    name: 'quantity',
    type: 'smallint',
  })
  quantity: number;

  @Column({
    name: 'invoice_id',
    type: 'int',
  })
  invoiceId: number;
}
