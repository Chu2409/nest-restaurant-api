import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tablesRepository: Repository<Table>,
  ) {}

  async findAll() {
    return await this.tablesRepository.find({});
  }

  async findAllAvailable() {
    const tables = await this.findAll();
    return tables.filter((table) => table.availability);
  }

  async findOne(id: number) {
    const table = await this.tablesRepository.findOneBy({ id });

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
    await this.tablesRepository.save(table);

    return { message: 'Table taken successfully' };
  }

  async releaseTable(id: number) {
    const table = await this.findOne(id);

    if (table.availability) {
      throw new BadRequestException(`Table with id ${id} is already empty`);
    }

    table.availability = true;
    await this.tablesRepository.save(table);

    return { message: 'Table released successfully' };
  }
}
