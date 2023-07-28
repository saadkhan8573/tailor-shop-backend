import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DresscutterService } from './dresscutter.service';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';

@Controller('dresscutter')
export class DresscutterController {
  constructor(private readonly dresscutterService: DresscutterService) {}

  @Post()
  create(@Body() createDresscutterDto: CreateDresscutterDto) {
    return this.dresscutterService.create(createDresscutterDto);
  }

  @Get()
  findAll() {
    return this.dresscutterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dresscutterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDresscutterDto: UpdateDresscutterDto) {
    return this.dresscutterService.update(+id, updateDresscutterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dresscutterService.remove(+id);
  }
}
