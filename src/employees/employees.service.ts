import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { LoginEmployeeDto } from './dto/login-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async login(loginEmployeeDto: LoginEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: {
        user: loginEmployeeDto.user,
        password: loginEmployeeDto.password,
      },
    });
    if (!employee) throw new BadRequestException('Invalid credentials');

    return employee;
  }
}
