import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVisitDto } from './dto/create-visit.dto';
import { Visit } from './entities/visit.entity';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    private readonly tablesService: TablesService,
  ) {}

  async create(createVisitDto: CreateVisitDto) {
    await this.tablesService.takeTable(createVisitDto.tableId);
    await this.visitRepository.save({
      table: { id: createVisitDto.tableId },
      entry: new Date(),
    });
    return { message: 'Visit created successfully' };
  }

  async findAll() {
    return await this.visitRepository.find({
      relations: ['table'],
    });
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

  async endVisit(id: number) {
    let visit = await this.findOne(id);
    if (!visit) {
      throw new NotFoundException(`Visit with id ${id} not found`);
    }

    visit = await this.visitRepository.save({
      ...visit,
      exit: new Date(),
    });

    await this.tablesService.releaseTable(visit.table.id);

    return visit;
  }
}
