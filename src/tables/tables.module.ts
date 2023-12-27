import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table } from './entities/table.entity';

@Module({
  controllers: [TablesController],
  providers: [TablesService],
  imports: [TypeOrmModule.forFeature([Table])],
})
export class TablesModule {}
