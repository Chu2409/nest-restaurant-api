import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesModule } from '../tables-ws/tables.module';
import { OrdersModule } from '../orders-ws/orders.module';
import { VisitsController } from './visits.controller';
import { VisitsGateway } from './visits.gateway';
import { Visit } from './entities/visit.entity';
import { VisitsService } from './visits.service';
@Module({
  controllers: [VisitsController],
  providers: [VisitsService, VisitsGateway],
  imports: [
    TypeOrmModule.forFeature([Visit]),
    TablesModule,
    forwardRef(() => OrdersModule),
  ],
  exports: [VisitsGateway],
})
export class VisitsModule {}
