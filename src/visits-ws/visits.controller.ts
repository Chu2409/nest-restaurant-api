import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get('include-inactive')
  findAllIncludingInactive() {
    return this.visitsService.findAllIncludingInactive();
  }

  // @Get('orders/:id')
  // findOneWithOrders(@Param('id', ParseIntPipe) id: number) {
  //   return this.visitsService.findOneWithOrders(id);
  // }

  @Get('master-orders/:id')
  async findOneWithUnitOrders(@Param('id', ParseIntPipe) id: number) {
    return await this.visitsService.findOneWithMasterOrders(id);
  }

  @Get('master-orders')
  async findWithUnitOrders() {
    return await this.visitsService.findWithMasterOrders();
  }
}
