import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import Stripe from 'stripe';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { OrdersService } from '../orders-ws/orders.service';
import { Order } from 'src/orders-ws/entities/order.entity';
import { INVOICE_STATE_ENUM } from 'src/common/enums/invoice-state.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,

    private readonly ordersService: OrdersService,
  ) {}

  private stripe = new Stripe(process.env.STRIPE_API_KEY);

  async findAll() {
    return await this.invoicesRepository.find();
  }

  async findOne(id: number) {
    const invoice = await this.invoicesRepository.findOneBy({ id });

    if (!invoice) throw new BadRequestException('Invoice not found');

    return invoice;
  }

  async remove(id: number) {
    const invoice = await this.findOne(id);

    return await this.invoicesRepository.remove(invoice);
  }

  async pay(payInvoiceDto: PayInvoiceDto) {
    const orders = await this.ordersService.getOrdersByVisitId(
      payInvoiceDto.visitId,
    );

    const total = orders.reduce(
      (acc, order) => acc + order.quantity * order.product.price,
      0,
    );

    try {
      const inv = this.invoicesRepository.create({
        total,
        paymentMethod: payInvoiceDto.paymentMethod,
        employee: { id: payInvoiceDto.employeeId },
        visit: { id: payInvoiceDto.visitId },
        customer: { id: payInvoiceDto.customerId },
      });

      const invoice = await this.invoicesRepository.save(inv);

      if (payInvoiceDto.paymentMethod !== 'EFECTIVO') {
        return this.payByCard(orders, invoice.id);
      } else {
        invoice.state = INVOICE_STATE_ENUM.CANCELADO;
        await this.invoicesRepository.save(invoice);
      }

      return invoice;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async payByCard(orders: Order[], invoiceId: number) {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    orders.forEach((order) => {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: order.product.name,
          },
          unit_amount: Math.round(order.product.price * 100),
        },
        quantity: order.quantity,
      });
    });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url:
        process.env.API_HOST +
        '/invoices/complete-pay-by-card?invoiceId=' +
        invoiceId,
    });

    return { url: session.url };
  }

  async completePayByCard(invoiceId: number) {
    const invoice = await this.findOne(invoiceId);

    invoice.state = INVOICE_STATE_ENUM.CANCELADO;

    return await this.invoicesRepository.save(invoice);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
