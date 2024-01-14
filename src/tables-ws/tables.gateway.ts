import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TablesService } from './tables.service';

@WebSocketGateway({ cors: true })
export class TablesGateway {
  @WebSocketServer()
  wss: Server;

  constructor(private readonly tablesService: TablesService) {}

  @SubscribeMessage('get-tables')
  async findAll() {
    const tables = await this.tablesService.findAll();
    this.wss.emit('load-tables', tables);
  }
}
