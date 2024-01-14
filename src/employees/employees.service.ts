import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

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

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const customer = this.employeeRepository.create(createEmployeeDto);

      return await this.employeeRepository.save(customer);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    return await this.employeeRepository.find();
  }

  async findOne(id: string) {
    const customer = await this.employeeRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Employee not found');
    }

    return customer;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const customer = await this.employeeRepository.preload({
      ...updateEmployeeDto,
      id,
    });

    if (!customer) {
      throw new NotFoundException('Employee not found');
    }

    return await this.employeeRepository.save(customer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    return await this.employeeRepository.remove(customer);
  }
}
