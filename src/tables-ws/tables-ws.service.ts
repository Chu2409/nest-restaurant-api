import { Injectable } from '@nestjs/common';
import { TablesService } from 'src/tables/tables.service';

@Injectable()
export class TablesWsService {
  constructor(private readonly tablesService: TablesService) {}

  async takeTable(tableId: number) {
    return await this.tablesService.takeTable(tableId);
  }

  async getTables() {
    return await this.tablesService.findAll();
  }
}
