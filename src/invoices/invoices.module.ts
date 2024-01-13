import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { OrdersModule } from 'src/orders-ws/orders.module';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [TypeOrmModule.forFeature([Invoice]), OrdersModule],
})
export class InvoicesModule {}
