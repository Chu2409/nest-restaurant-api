import { Module } from '@nestjs/common';
import { MasterOrdersService } from './master-orders.service';
import { MasterOrdersGateway } from './master-orders.gateway';
import { OrdersModule } from 'src/orders-ws/orders.module';
import { VisitsModule } from 'src/visits-ws/visits.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders-ws/entities/order.entity';
import { UnitOrder } from 'src/orders-ws/entities/unit-order.entity';
import { Visit } from 'src/visits-ws/entities/visit.entity';
import { MasterOrder } from './entities/master-order.entity';
import { Product } from 'src/products/entities/product.entity';

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
