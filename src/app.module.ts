import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { TablesModule } from './tables-ws/tables.module';
import { VisitsModule } from './visits-ws/visits.module';
import { OrdersModule } from './orders-ws/orders.module';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { EmployeesModule } from './employees/employees.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MasterOrdersModule } from './master-orders/master-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true',
    }),
    CustomersModule,
    TablesModule,
    VisitsModule,
    OrdersModule,
    ProductsModule,
    CommonModule,
    EmployeesModule,
    InvoicesModule,
    TablesModule,
    MasterOrdersModule,
  ],
})
export class AppModule {}
