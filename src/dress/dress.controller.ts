import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DressService } from './dress.service';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';

@Controller('dress')
export class DressController {
  constructor(private readonly dressService: DressService) {}

  @Post()
  create(@Body() createDressDto: CreateDressDto) {
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
