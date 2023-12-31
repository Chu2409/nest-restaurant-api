import { Module } from '@nestjs/common';
import { MasterOrdersService } from './master-orders.service';
import { MasterOrdersGateway } from './master-orders.gateway';

@Module({
  providers: [MasterOrdersGateway, MasterOrdersService],
})
export class MasterOrdersModule {}
