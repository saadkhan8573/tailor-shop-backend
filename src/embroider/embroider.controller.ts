import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Tailor } from 'src/tailor/entities';
import { TailorService } from 'src/tailor/tailor.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { CreateEmbroiderDto } from './dto/create-embroider.dto';
import { UpdateEmbroiderDto } from './dto/update-embroider.dto';
import { EmbroiderService } from './embroider.service';

@Controller('embroider')
export class EmbroiderController {
  constructor(
    private readonly embroiderService: EmbroiderService,
    private readonly tailorService: TailorService,
  ) {}

  @Post()
  async create(
    @Body() createEmbroiderDto: CreateEmbroiderDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    const tailor = await this.tailorService.findOne(+createEmbroiderDto.tailor);
    if (!tailor) {
      throw new BadRequestException('Tailor Not found');
    }
    return this.embroiderService.create({
      ...createEmbroiderDto,
      user: createUserDto as User,
      tailor: createEmbroiderDto.tailor as Tailor,
    });
  }

  @Get()
  findAll() {
    return this.embroiderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embroiderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmbroiderDto: UpdateEmbroiderDto,
  ) {
    return this.embroiderService.update(+id, updateEmbroiderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embroiderService.remove(+id);
  }
}
