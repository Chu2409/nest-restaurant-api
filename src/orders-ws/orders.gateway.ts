import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  // ConnectedSocket,
  // MessageBody,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  // WsException,
} from '@nestjs/websockets';
import {
  Catch,
  HttpException,
  Inject,
  UseFilters,
  forwardRef,
} from '@nestjs/common';
import {
  Server,
  Socket,
  //Socket
} from 'socket.io';
import { PRODUCT_STATE_ENUM } from '../common/enums/product-state.enum';
import { VisitsGateway } from '../visits-ws/visits.gateway';
import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeProductOrderStatusDto } from './dto/change-product-order-status.dto';
// import { ChangeProductOrderStatusDto } from './dto/change-product-order-status.dto';

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
    @Inject(forwardRef(() => VisitsGateway))
    private readonly visitsGateaway: VisitsGateway,
    private readonly ordersService: OrdersService,
  ) {}

  // @UseFilters(WsAndHttpExceptionFilter)
  // @SubscribeMessage('create-order')
  // async createOrder(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() createOrderDto: CreateOrderDto,
  // ) {
  //   let order;
  //   try {
  //     order = await this.ordersService.create(createOrderDto);
  //     client.emit('order-response', order);

  //     this.visitsGateaway.findWithOrders();
  //     this.visitsGateaway.findWithUnitOrders();
  //   } catch (error) {
  //     if (!order)
  //       client.emit('order-error', { message: error.response.message });
  //   }
  // }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('change-status-unit-order')
  async changeStatusUnitOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() changeProductOrderStatusDto: ChangeProductOrderStatusDto,
  ) {
    try {
      const order = await this.ordersService.changeStatusUnitOrder(
        changeProductOrderStatusDto,
      );

      if (order === false)
        throw new Error('No se pudo cambiar el estado del pedido');

      client.emit('change-status-unit-order-response', order);

      if (changeProductOrderStatusDto.state === PRODUCT_STATE_ENUM.LISTO) {
        this.wss.emit('order-ready', order);
      }
    } catch (error) {
      client.emit('change-status-unit-order-error', {
        message: error,
      });
    }
  }

  // @UseFilters(WsAndHttpExceptionFilter)
  // @SubscribeMessage('serve-unit-order')
  // async serveUnitOrder(@MessageBody() unitOrderId: number) {
  //   let order;
  //   try {
  //     order = await this.ordersService.serveUnitOrder(unitOrderId);
  //     this.wss.emit('serve-unit-order-response', order);

  //     this.getServeUnitOrders();
  //   } catch (error) {
  //     if (!order)
  //       this.wss.emit('serve-unit-order-error', {
  //         message: error.response.message,
  //       });
  //   }
  // }

  // @UseFilters(WsAndHttpExceptionFilter)
  // @SubscribeMessage('get-serve-unit-orders')
  // async getServeUnitOrders() {
  //   let orders;
  //   try {
  //     orders = await this.ordersService.getServeUnitOrders();
  //     this.wss.emit('load-serve-unit-orders', orders);

  //     this.visitsGateaway.findWithOrders();
  //     this.visitsGateaway.findWithUnitOrders();
  //   } catch (error) {
  //     if (!orders)
  //       this.wss.emit('load-serve-unit-orders-error', {
  //         message: error.response.message,
  //       });
  //   }
  // }
}
