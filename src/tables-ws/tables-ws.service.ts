import { Injectable } from '@nestjs/common';
import { TablesService } from 'src/tables/tables.service';

@Injectable()
export class TablesWsService {
  constructor(private readonly tablesService: TablesService) {}

  async getTables() {
    return await this.tablesService.findAll();
  }

  async takeTable(tableId: number) {
    return await this.tablesService.takeTable(tableId);
  }

  async releaseTable(tableId: number) {
    return await this.tablesService.releaseTable(tableId);
  }
}
