import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);

      return await this.customerRepository.save(customer);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    return await this.customerRepository.find();
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.preload({
      ...updateCustomerDto,
      id,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return await this.customerRepository.save(customer);
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    return await this.customerRepository.remove(customer);
  }
}
