import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesGateway } from './tables.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { TablesController } from './tables.controller';

@Module({
  controllers: [TablesController],
  providers: [TablesGateway, TablesService],
  imports: [TypeOrmModule.forFeature([Table])],
  exports: [TablesService, TablesGateway],
})
export class TablesModule {}
