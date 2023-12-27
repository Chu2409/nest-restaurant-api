import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async findAll() {
    return await this.tableRepository.find({});
  }

  async findAllAvailable() {
    const tables = await this.findAll();
    return tables.filter((table) => table.availability);
  }

  async findOne(id: number) {
    const table = await this.tableRepository.findOneBy({ id });

    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }

    return table;
  }

  async takeTable(id: number) {
    const table = await this.findOne(id);

    if (!table.availability) {
      throw new BadRequestException(`Table with id ${id} is not available`);
    }

    table.availability = false;
    return await this.tableRepository.save(table);
  }

  async releaseTable(id: number) {
    const table = await this.findOne(id);

    if (table.availability) {
      throw new BadRequestException(`Table with id ${id} is already empty`);
    }

    table.availability = true;
    return await this.tableRepository.save(table);
  }
}
