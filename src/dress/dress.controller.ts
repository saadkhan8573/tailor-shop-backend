import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { DressService } from './dress.service';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';
import { TailorService } from 'src/tailor/tailor.service';
import { CustomerService } from 'src/customer/customer.service';

@Controller('dress')
export class DressController {
  constructor(
    private readonly dressService: DressService,
    private readonly tailorService: TailorService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async create(@Body() createDressDto: CreateDressDto) {
    if (!createDressDto.tailor) {
      throw new BadRequestException('Tailor is required!');
    }
    if (!createDressDto.customer) {
      throw new BadRequestException('Customer is required!');
    }
    const tailor = await this.tailorService.findOne(+createDressDto.tailor);
    if (!tailor) {
      throw new BadRequestException('Tailor not found!');
    }

    const customer = await this.customerService.findOne(
      +createDressDto.customer,
    );
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    return this.dressService.create(createDressDto);
  }

  @Get()
  findAll() {
    return this.dressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDressDto: UpdateDressDto) {
    return this.dressService.update(+id, updateDressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dressService.remove(+id);
  }
}
