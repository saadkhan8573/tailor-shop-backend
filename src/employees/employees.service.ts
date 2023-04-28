import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeeRepository.save(createEmployeeDto);
  }

  findAll() {
    return this.employeeRepository.find({ relations: ['user', 'tailor.user'] });
  }

  findAndSelectIds() {
    return this.employeeRepository.find({ select: { id: true } });
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async removeAllEmployees() {
    const ids = await this.findAndSelectIds();
    return await this.employeeRepository.remove(ids);
  }
}
