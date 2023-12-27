import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Visit } from './entities/visit.entity';

@Module({
  controllers: [VisitsController],
  providers: [VisitsService],
  imports: [TypeOrmModule.forFeature([Visit])],
})
export class VisitsModule {}
