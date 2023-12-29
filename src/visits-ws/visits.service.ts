import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateVisitDto } from './dto/create-visit.dto';
import { Visit } from './entities/visit.entity';
import { TablesService } from 'src/tables-ws/tables.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly tablesService: TablesService,
    private readonly dataSource: DataSource,
  ) {}

  async findAllIncludingInactive() {
    return await this.visitRepository.find({
      relations: ['table'],
    });
  }

  async findAll() {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb.where('visit.exit IS NULL').getMany();
  }

  async findWithOrders() {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .where('visit.exit IS NULL')
      .getMany();
  }

  async findOneWithOrders(id: number) {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.orders', 'order')
      .leftJoinAndSelect('order.product', 'product')
      .where('visit.id = :id', { id })
      .getOne();
  }

  async findWithUnitOrdersPreparing() {
    const qb = this.dataSource.createQueryBuilder(Visit, 'visit');
    return await qb
      .leftJoinAndSelect('visit.unitOrders', 'unitOrder')
      .leftJoinAndSelect('unitOrder.product', 'product')
      .where("unitOrder.productState = 'PREPARANDO'")
      .andWhere('visit.exit IS NULL')
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
    await this.visitRepository.save({
      table: { id: createVisitDto.tableId },
      entry: new Date(),
    });
    return { message: 'Visit created successfully' };
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
