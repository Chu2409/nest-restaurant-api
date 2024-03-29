import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsModule } from '../visits-ws/visits.module';
import { OrdersGateway } from './orders.gateway';
import { UnitOrder } from './entities/unit-order.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway],
  imports: [
    TypeOrmModule.forFeature([Order, UnitOrder]),
    forwardRef(() => VisitsModule),
    ProductsModule,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
