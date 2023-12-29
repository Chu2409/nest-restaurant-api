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
import { CreateVisitDto } from './dto/create-visit.dto';
import { VisitsService } from './visits.service';
import { TablesGateway } from 'src/tables-ws/tables.gateway';

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
export class VisitsGateway {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly tablesGateway: TablesGateway,
    private readonly visitsService: VisitsService,
  ) {}

  @SubscribeMessage('get-visits-active')
  async getVisitsActive() {
    const visits = await this.visitsService.findAllActive();
    this.wss.emit('load-visits', visits);
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('create-visit')
  async createVisit(
    @ConnectedSocket() client: Socket,
    @MessageBody() createVisitDto: CreateVisitDto,
  ) {
    let visit;
    try {
      visit = await this.visitsService.createVisit(createVisitDto);

      client.emit('visit-response', visit);

      this.tablesGateway.getTables();
      this.getVisitsActive();
    } catch (error) {
      if (!visit)
        client.emit('visit-response', { message: error.response.message });
    }
  }

  @UseFilters(WsAndHttpExceptionFilter)
  @SubscribeMessage('end-visit')
  async endVisit(
    @ConnectedSocket() client: Socket,
    @MessageBody('visitId') visitId: number,
  ) {
    let visit;
    try {
      visit = await this.visitsService.endVisit(visitId);

      client.emit('visit-response', visit);

      this.tablesGateway.getTables();
      this.getVisitsActive();
    } catch (error) {
      if (!visit)
        client.emit('visit-response', { message: error.response.message });
    }
  }
}
