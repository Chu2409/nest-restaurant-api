import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get('include-inactive')
  findAllIncludingInactive() {
    return this.visitsService.findAllIncludingInactive();
  }

  @Get('orders/:id')
  findOneWithOrders(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.findOneWithOrders(id);
  }

  @Get('unit-orders/:id')
  findOneWithUnitOrders(@Param('id', ParseIntPipe) id: number) {
    return this.visitsService.findOneWithUnitOrders(id);
  }
}
