import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities';
import { UserService } from 'src/user/user.service';
import { TailorService } from 'src/tailor/tailor.service';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly userService: UserService,
    private readonly tailorService: TailorService,
  ) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    // const user = await this.userService.create(createUserDto);
    const tailor = await this.tailorService.findOne(
      Number(createEmployeeDto.tailor),
    );
    return await this.employeesService.create({
      ...createEmployeeDto,
      user : createUserDto as User,
      tailor,
    });
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }

  @Delete('remove/all')
  removeAll() {
    return this.employeesService.removeAllEmployees();
  }
}
