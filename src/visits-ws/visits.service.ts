import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateVisitDto } from './dto/create-visit.dto';
import { Visit } from './entities/visit.entity';
import { TablesService } from 'src/tables-ws/tables.service';
import { OrdersService } from '../orders-ws/orders.service';

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
    return await this.visitRepository.find({
      where: { exit: null },
      relations: ['table'],
    });
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
}
