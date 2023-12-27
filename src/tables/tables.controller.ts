import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get('available')
  findAllAvailable() {
    return this.tablesService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findOne(id);
  }

  @Patch('take/:id')
  takeTable(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.takeTable(id);
  }

  @Patch('empty/:id')
  releaseTable(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.releaseTable(id);
  }
}
