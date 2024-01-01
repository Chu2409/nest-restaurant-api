import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { MasterOrdersService } from './master-orders.service';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { Server } from 'socket.io';
import { Catch, HttpException, UseFilters } from '@nestjs/common';

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
export class MasterOrdersGateway {
  @WebSocketServer()
  wss: Server;

  constructor(private readonly masterOrdersService: MasterOrdersService) {}

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('create-master-order')
  async create(@MessageBody() createMasterOrderDto: CreateMasterOrderDto) {
    try {
      const masterOrder =
        await this.masterOrdersService.create(createMasterOrderDto);
      if (masterOrder) {
        this.wss.emit('create-master-order-response', masterOrder);
      } else {
        this.wss.emit(
          'create-master-order-error',
          'No se pudo crear el pedido',
        );
      }
    } catch (error) {
      this.wss.emit('create-master-order-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-all-master-orders')
  async findAll() {
    const masterOrders = await this.masterOrdersService.findAll();
    if (masterOrders) {
      this.wss.emit('load-all-master-orders', masterOrders);
    } else {
      this.wss.emit('load-all-master-orders-error', 'No hay pedidos');
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-active-master-orders')
  async findAllActive() {
    try {
      const masterOrders = await this.masterOrdersService.findAllActive();
      if (masterOrders) {
        this.wss.emit('load-active-master-orders', masterOrders);
      } else {
        this.wss.emit(
          'load-active-master-orders-error',
          'No hay pedidos activos',
        );
      }
    } catch (error) {
      this.wss.emit('load-active-master-orders-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-preparing-master-orders')
  async findAllPreparing() {
    try {
      const masterOrders = await this.masterOrdersService.findAllPreparing();
      if (masterOrders) {
        this.wss.emit('load-preparing-master-orders', masterOrders);
      } else {
        this.wss.emit(
          'load-preparing-master-orders-error',
          'No hay pedidos preparando',
        );
      }
    } catch (error) {
      this.wss.emit('load-preparing-master-orders-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-ready-master-orders')
  async findAllReady() {
    try {
      const masterOrders = await this.masterOrdersService.findAllReady();
      if (masterOrders) {
        this.wss.emit('load-ready-master-orders', masterOrders);
      } else {
        this.wss.emit(
          'load-ready-master-orders-error',
          'No hay pedidos listos',
        );
      }
    } catch (error) {
      this.wss.emit('load-ready-master-orders-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-served-master-orders')
  async findAllServed() {
    try {
      const masterOrders = await this.masterOrdersService.findAllServed();
      if (masterOrders) {
        this.wss.emit('load-served-master-orders', masterOrders);
      } else {
        this.wss.emit(
          'load-served-master-orders-error',
          'No hay pedidos servidos',
        );
      }
    } catch (error) {
      this.wss.emit('load-served-master-orders-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('find-one-master-order')
  async findOne(@MessageBody() id: number) {
    try {
      const masterOrder = await this.masterOrdersService.findOne(id);
      if (masterOrder) {
        this.wss.emit('load-one-master-order', masterOrder);
      } else {
        this.wss.emit(
          'load-one-master-order-error',
          'No se encontró el pedido',
        );
      }
    } catch (error) {
      this.wss.emit('load-one-master-order-error', error);
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('remove-master-order')
  async remove(@MessageBody() id: number) {
    try {
      const masterOrder = await this.masterOrdersService.remove(id);
      if (masterOrder) {
        this.wss.emit('remove-master-order-response', masterOrder);
      } else {
        this.wss.emit(
          'remove-master-order-error',
          'No se pudo eliminar el pedido',
        );
      }
    } catch (error) {
      this.wss.emit('remove-master-order-error', error);
    }
  }
}
