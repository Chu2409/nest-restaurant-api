import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { TablesWsService } from './tables-ws.service';
import { Server, Socket } from 'socket.io';
import { Catch, HttpException, ParseIntPipe, UseFilters } from '@nestjs/common';

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
export class TablesWsGateway {
  @WebSocketServer()
  wss: Server;

  constructor(private readonly tablesWsService: TablesWsService) {}

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('take-table')
  async takeTable(
    @ConnectedSocket() client: Socket,
    @MessageBody('tableId', ParseIntPipe) tableId: number,
  ) {
    let table;
    try {
      table = await this.tablesWsService.takeTable(tableId);
      client.emit('take-table-response', table);

      this.getTables();
    } catch (error) {
      if (!table)
        client.emit('take-table-response', { message: error.response.message });
    }
  }

  @SubscribeMessage('get-tables')
  async getTables() {
    const tables = await this.tablesWsService.getTables();
    this.wss.emit('load-tables', tables);
  }
}
