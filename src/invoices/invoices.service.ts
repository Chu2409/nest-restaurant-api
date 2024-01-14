import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { INVOICE_STATE_ENUM } from '../common/enums/invoice-state.enum';
import { Invoice } from './entities/invoice.entity';
import { Order } from '../orders-ws/entities/order.entity';
import { OrdersService } from '../orders-ws/orders.service';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import {
  DaysTotalByMonthDto,
  getMonthsBase,
  MonthsTotalByYearDto,
  MonthTotalByYearResponse,
} from './dto/total-report.dto';
import { getDaysBase, DayTotalByMonthResponse } from './dto/total-report.dto';

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

    if (!orders || orders.length === 0)
      throw new BadRequestException('No orders found');

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

  async getDaysTotalByMonth({
    month,
    year,
  }: DaysTotalByMonthDto): Promise<DayTotalByMonthResponse> {
    const daysWithTotal: DayTotalByMonthResponse = getDaysBase(month);

    const qb = this.invoicesRepository.createQueryBuilder('invoice');
    const totalByDay = await qb
      .innerJoin('invoice.visit', 'visit')
      .where("invoice.state = 'CANCELADO'")
      .andWhere(
        'EXTRACT (MONTH FROM(visit.exit)) = :month AND EXTRACT(YEAR FROM (visit.exit)) = :year',
        {
          month,
          year,
        },
      )
      .select('EXTRACT(DAY FROM visit.exit) :: SMALLINT', 'day')
      .addSelect('SUM(invoice.total)', 'total')
      .groupBy('day')
      .orderBy('day')
      .getRawMany();

    totalByDay.forEach((total) => {
      daysWithTotal[total.day] = total.total;
    });

    return daysWithTotal;
  }

  async getMonthsTotalByYear({
    year,
  }: MonthsTotalByYearDto): Promise<MonthTotalByYearResponse> {
    const monthsWithTotal: MonthTotalByYearResponse = getMonthsBase();

    const qb = this.invoicesRepository.createQueryBuilder('invoice');
    const totalByMonth = await qb
      .innerJoin('invoice.visit', 'visit')
      .where("invoice.state = 'CANCELADO'")
      .andWhere('EXTRACT(YEAR FROM (visit.exit)) = :year', {
        year,
      })
      .select('EXTRACT(MONTH FROM visit.exit) :: SMALLINT', 'month')
      .addSelect('SUM(invoice.total)', 'total')
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    totalByMonth.forEach((total) => {
      monthsWithTotal[total.month] = total.total;
    });

    return monthsWithTotal;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
