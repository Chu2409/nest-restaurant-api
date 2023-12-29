import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TablesService } from './tables.service';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TablesGateway {
  @WebSocketServer()
  wss: Server;

  constructor(private readonly tablesService: TablesService) {}

  @SubscribeMessage('get-tables')
  async getTables() {
    const tables = await this.tablesService.findAll();
    this.wss.emit('load-tables', tables);
  }

  // @UseFilters(WsAndHttpExceptionFilter)
  // @SubscribeMessage('take-table')
  // async takeTable(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody('tableId', ParseIntPipe) tableId: number,
  // ) {
  //   let table;
  //   try {
  //     table = await this.tablesService.takeTable(tableId);
  //     client.emit('table-response', table);

  //     this.getTables();
  //   } catch (error) {
  //     if (!table)
  //       client.emit('table-response', { message: error.response.message });
  //   }
  // }

  // @UseFilters(WsAndHttpExceptionFilter)
  // @SubscribeMessage('release-table')
  // async releaseTable(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody('tableId', ParseIntPipe) tableId: number,
  // ) {
  //   let table;
  //   try {
  //     table = await this.tablesService.releaseTable(tableId);
  //     client.emit('table-response', table);

  //     this.getTables();
  //   } catch (error) {
  //     if (!table)
  //       client.emit('table-response', { message: error.response.message });
  //   }
  // }
}
