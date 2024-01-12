import { Body, Controller, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { LoginEmployeeDto } from './dto/login-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('login')
  login(@Body() loginEmployeeDto: LoginEmployeeDto) {
    return this.employeesService.login(loginEmployeeDto);
  }
}
