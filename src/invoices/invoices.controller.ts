import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PayInvoiceDto } from './dto/pay-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('complete-pay-by-card')
  async complete(@Query('invoiceId', ParseIntPipe) invoiceId: number) {
    return this.invoicesService.completePayByCard(invoiceId);
  }

  @Get()
  async findAll() {
    return await this.invoicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.invoicesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.invoicesService.remove(+id);
  }

  @Post('pay')
  async pay(@Body() payInvoiceDto: PayInvoiceDto) {
    return await this.invoicesService.pay(payInvoiceDto);
  }
}
