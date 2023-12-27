import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVisitDto } from './dto/create-visit.dto';
import { EndVisitDto } from './dto/end-visit.dto';
import { Visit } from './entities/visit.entity';
import { TablesService } from 'src/tables/tables.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,

    private readonly tablesService: TablesService,
  ) {}

  async create(createVisitDto: CreateVisitDto) {
    await this.tablesService.takeTable(createVisitDto.tableId);
    const visit = await this.visitRepository.save({
      table: { id: createVisitDto.tableId },
      entry: new Date(),
    });
    return visit;
  }

  async findAll() {
    return await this.visitRepository.find({
      relations: ['table', 'customer'],
    });
  }

  async findOne(id: number) {
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: ['table', 'customer'],
    });

    if (!visit) {
      throw new NotFoundException(`Visit with id ${id} not found`);
    }

    return visit;
  }

  async endVisit(id: number, endVisitDto: EndVisitDto) {
    let visit = await this.findOne(id);
    if (!visit) {
      throw new NotFoundException(`Visit with id ${id} not found`);
    }

    visit = await this.visitRepository.save({
      ...visit,
      exit: new Date(),
      customer: { id: endVisitDto.customerId },
    });

    await this.tablesService.releaseTable(visit.table.id);

    return visit;
  }
}
