import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Catch, HttpException, UseFilters } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VisitsGateway } from 'src/visits-ws/visits.gateway';
import { ChangeProductOrderStatusDto } from './dto/change-product-order-status.dto';

@Catch(WsException, HttpException)
class WsAndHttpExceptionFilter {
  // public catch(exception: HttpException, host: ArgumentsHost) {
  public catch() {
    // Here you have the exception and you can check the data
    // const ctx = host.switchToWs();
    // const client = ctx.getClient() as Socket;
    // client.emit('take-table-response', exception.message);
    // console.log('Error');
  }
}

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly visitsGateaway: VisitsGateway,
    private readonly ordersService: OrdersService,
  ) {}

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('create-order')
  async createOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() createOrderDto: CreateOrderDto,
  ) {
    let order;
    try {
      order = await this.ordersService.create(createOrderDto);
      client.emit('order-response', order);

      this.visitsGateaway.findWithOrders();
      this.visitsGateaway.findWithUnitOrders();
    } catch (error) {
      if (!order)
        client.emit('order-response', { message: error.response.message });
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('change-status-unit-order')
  async changeStatusUnitOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() changeProductOrderStatusDto: ChangeProductOrderStatusDto,
  ) {
    let order;
    try {
      order = await this.ordersService.changeStatusUnitOrder(
        changeProductOrderStatusDto,
      );
      client.emit('change-status-unit-order-response', order);

      this.visitsGateaway.findWithOrders();
      this.visitsGateaway.findWithUnitOrders();
    } catch (error) {
      if (!order)
        client.emit('change-status-unit-order-response', {
          message: error.response.message,
        });
    }
  }
}
