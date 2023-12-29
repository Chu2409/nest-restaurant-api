import { Module } from '@nestjs/common';
import { TablesWsService } from './tables-ws.service';
import { TablesWsGateway } from './tables-ws.gateway';
import { TablesModule } from 'src/tables/tables.module';

@Module({
  providers: [TablesWsGateway, TablesWsService],
  imports: [TablesModule],
})
export class TablesWsModule {}
