import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DressType } from 'src/dress/entities/dressType.entity';
import { TailorService } from 'src/tailor/tailor.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly tailorService: TailorService,
  ) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const tailor = await this.tailorService.findOwnerByIds(
        String(createCustomerDto.tailor),
      );

      if (!tailor.length) {
        throw new BadRequestException('Tailor does not exist or removed');
      }

      return this.customerService.create({
        ...createCustomerDto,
        user: { ...createUserDto } as User,
        tailor,
      });
    } catch (error) {}
  }

  @Get()
  findAll(@Query('dresstype') dresstype: DressType) {
    return this.customerService.findAll(dresstype);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @Delete('remove/all')
  removeAll() {
    return this.customerService.removeAll();
  }
}
