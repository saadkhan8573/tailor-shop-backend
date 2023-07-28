import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkdetailService } from './workdetail.service';
import { CreateWorkdetailDto } from './dto/create-workdetail.dto';
import { UpdateWorkdetailDto } from './dto/update-workdetail.dto';

@Controller('workdetail')
export class WorkdetailController {
  constructor(private readonly workdetailService: WorkdetailService) {}

  @Post()
  create(@Body() createWorkdetailDto: CreateWorkdetailDto) {
    return this.workdetailService.create(createWorkdetailDto);
  }

  @Get()
  findAll() {
    return this.workdetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workdetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkdetailDto: UpdateWorkdetailDto,
  ) {
    return this.workdetailService.update(+id, updateWorkdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workdetailService.remove(+id);
  }
}
