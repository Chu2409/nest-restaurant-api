import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders-ws/orders.module';
import { VisitsModule } from '../visits-ws/visits.module';
import { MasterOrdersGateway } from './master-orders.gateway';
import { Order } from '../orders-ws/entities/order.entity';
import { UnitOrder } from '../orders-ws/entities/unit-order.entity';
import { Visit } from '../visits-ws/entities/visit.entity';
import { MasterOrder } from './entities/master-order.entity';
import { Product } from '../products/entities/product.entity';
import { MasterOrdersService } from './master-orders.service';

@Module({
  providers: [MasterOrdersGateway, MasterOrdersService],
  exports: [MasterOrdersService, MasterOrdersGateway],
  imports: [
    OrdersModule,
    VisitsModule,
    TypeOrmModule.forFeature([MasterOrder, Order, UnitOrder, Visit, Product]),
  ],
})
export class MasterOrdersModule {}
