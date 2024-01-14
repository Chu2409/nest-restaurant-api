import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { TablesService } from '../tables-ws/tables.service';
import { OrdersService } from '../orders-ws/orders.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import {
  VisitsByMonthDto,
  VisitsByYearDto,
  getDaysBase,
  getMonthsBase,
} from './dto/visits-report.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly tablesService: TablesService,
    private readonly dataSource: DataSource,

    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async findAllIncludingInactive() {
    return await this.visitRepository.find({
      relations: ['table'],
    });
  }

  async findAll() {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.table', 'table')
      .where('visit.exit IS NULL')
      .getMany();
  }

  // async findWithOrders() {
  //   const ordersVisit = await this.ordersService.getUnitOPerVisitsFIFO();
  //   const visits = [];

  //   for (const visit of ordersVisit) {
  //     visits.push(await this.findOneWithOrders(visit.visit.id));
  //   }

  //   return visits;
  // }

  // async findOneWithOrders(id: number) {
  //   const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
  //   return await qb
  //     .leftJoinAndSelect('visit.orders', 'order')
  //     .leftJoinAndSelect('order.product', 'product')
  //     .where('visit.id = :id', { id })
  //     .getOne();
  // }

  // async findWithUnitOrders() {
  //   const ordersVisit = await this.ordersService.getUnitOPerVisitsFIFO();
  //   const visits = [];

  //   for (const visit of ordersVisit) {
  //     visits.push(await this.findOneWithUnitOrders(visit.visit.id));
  //   }

  //   return visits;
  // }

  async findWithMasterOrders() {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.unitOrders', 'unitOrder')
      .leftJoinAndSelect('unitOrder.product', 'product')
      .getMany();
  }

  async findOneWithUnitOrders(id: number) {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.unitOrders', 'unitOrder')
      .leftJoinAndSelect('unitOrder.product', 'product')
      .where('visit.id = :id', { id })
      .getOne();
  }

  async findOne(id: number) {
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: ['table'],
    });

    if (!visit) {
      throw new NotFoundException(`Visit with id ${id} not found`);
    }

    return visit;
  }

  async createVisit(createVisitDto: CreateVisitDto) {
    await this.tablesService.takeTable(createVisitDto.tableId);
    const visit = await this.visitRepository.save({
      table: { id: createVisitDto.tableId },
      entry: new Date(),
    });
    return { visitId: visit.id, message: 'Visit created successfully' };
  }

  async endVisit(id: number) {
    let visit = await this.findOne(id);

    if (visit.exit) {
      throw new BadRequestException(`Visit with id ${id} is already ended`);
    }

    await this.tablesService.releaseTable(visit.table.id);

    visit = await this.visitRepository.save({
      ...visit,
      exit: new Date(),
    });

    return { message: 'Visit ended successfully' };
  }

  async findOneWithMasterOrders(id: number) {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.masterOrders', 'masterOrder')
      .leftJoinAndSelect('masterOrder.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .leftJoinAndSelect('order.unitOrders', 'unitOrder')
      .leftJoinAndSelect('visit.table', 'table')
      .where('visit.id = :id', { id })
      .getOne();
  }

  async getVisitsByMonth({ month, year }: VisitsByMonthDto) {
    const daysVisits = getDaysBase(month);

    const qb = this.visitRepository.createQueryBuilder('visit');
    const response = await qb
      .where('visit.exit IS NOT NULL')
      .andWhere(
        'EXTRACT (MONTH FROM(visit.exit)) = :month AND EXTRACT(YEAR FROM (visit.exit)) = :year',
        {
          month,
          year,
        },
      )
      .select('EXTRACT(DAY FROM visit.exit) :: SMALLINT', 'day')
      .addSelect('COUNT(visit.id) :: SMALLINT', 'visits')
      .groupBy('day')
      .orderBy('day')
      .getRawMany();

    response.forEach((total) => {
      daysVisits[total.day] = total.visits;
    });

    return daysVisits;
  }

  async getVisitsByYear({ year }: VisitsByYearDto) {
    const monthsVisits = getMonthsBase();

    const qb = this.visitRepository.createQueryBuilder('visit');
    const response = await qb
      .where('visit.exit IS NOT NULL')
      .andWhere('EXTRACT(YEAR FROM (visit.exit)) = :year', {
        year,
      })
      .select('EXTRACT(MONTH FROM visit.exit) :: SMALLINT', 'month')
      .addSelect('COUNT(visit.id) :: SMALLINT', 'visits')
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    response.forEach((total) => {
      monthsVisits[total.month] = total.visits;
    });

    return monthsVisits;
  }
}
