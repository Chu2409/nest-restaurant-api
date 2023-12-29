import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Visit } from './entities/visit.entity';
import { TablesModule } from 'src/tables-ws/tables.module';
import { VisitsGateway } from './visits.gateway';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService, VisitsGateway],
  imports: [TypeOrmModule.forFeature([Visit]), TablesModule],
  exports: [VisitsGateway],
})
export class VisitsModule {}
