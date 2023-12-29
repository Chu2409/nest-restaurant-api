import { Controller, Get } from '@nestjs/common';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get('include-inactive')
  findAllIncludingInactive() {
    return this.visitsService.findAllIncludingInactive();
  }
}
