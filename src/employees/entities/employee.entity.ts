import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EMPLOYEE_ROLE_ENUM } from '../../common/enums/employee-role.enum';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('employees')
export class Employee {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: '10',
    unique: true,
  })
  id: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: '50',
  })
  firstName: string;

  @Column({
    name: 'second_name',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  secondName?: string;

  @Column({
    name: 'first_last_name',
    type: 'varchar',
    length: '50',
  })
  firstLastName: string;

  @Column({
    name: 'second_last_name',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  secondLastName?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: '255',
  })
  email: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '10',
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: '200',
    nullable: true,
  })
  address?: string;

  @Column({
    name: 'user',
    type: 'varchar',
    length: '50',
  })
  user: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: '50',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: EMPLOYEE_ROLE_ENUM,
    default: EMPLOYEE_ROLE_ENUM.MESERO,
  })
  role: EMPLOYEE_ROLE_ENUM;

  @OneToMany(() => Invoice, (invoice) => invoice.employee)
  invoices?: Invoice[];
}
