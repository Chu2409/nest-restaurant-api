import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceLog } from './entities/invoice-log.entity';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceLog])],
})
export class InvoicesModule {}
