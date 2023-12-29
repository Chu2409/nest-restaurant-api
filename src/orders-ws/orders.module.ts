import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UnitOrder } from './entities/unit-order.entity';
import { OrdersGateway } from './orders.gateway';
import { VisitsModule } from 'src/visits-ws/visits.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  imports: [TypeOrmModule.forFeature([Order, UnitOrder]), VisitsModule],
})
export class OrdersModule {}
