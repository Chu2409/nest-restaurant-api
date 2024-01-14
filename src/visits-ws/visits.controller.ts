import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsByMonthDto, VisitsByYearDto } from './dto/visits-report.dto';

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

  @Post('get-visits-by-month')
  async getVisitsByMonth(@Body() visitsByMonthDto: VisitsByMonthDto) {
    return await this.visitsService.getVisitsByMonth(visitsByMonthDto);
  }

  @Post('get-visits-by-year')
  async getVisitsByYear(@Body() visitsByYearDto: VisitsByYearDto) {
    return await this.visitsService.getVisitsByYear(visitsByYearDto);
  }
}
