import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { Tailor } from 'src/tailor/entities';
import { TailorService } from 'src/tailor/tailor.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { CreateEmbroiderDto } from './dto/create-embroider.dto';
import { UpdateEmbroiderDto } from './dto/update-embroider.dto';
import { EmbroiderService } from './embroider.service';
import { EmbroideryStatusEnum } from 'src/dress/enum';
import { DressService } from 'src/dress/dress.service';

@Controller('embroider')
export class EmbroiderController {
  constructor(
    private readonly embroiderService: EmbroiderService,
    private readonly tailorService: TailorService,
    private readonly dressService: DressService,
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

  @Patch('change-status/:id')
  async changeDressEmbroideryStatus(
    @Param('id') id: number,
    @Query('status') status: EmbroideryStatusEnum,
  ) {
    if (!id) {
      throw new BadRequestException('Dress id is required!');
    }
    if (!status) {
      throw new BadRequestException('Dress Embroidery Status is required!');
    }

    const dress = await this.dressService.findOne(+id);

    if (!dress) {
      throw new BadRequestException('Dress not found!');
    }

    if (status === EmbroideryStatusEnum.Completed) {
      dress.isEmbroidered = true;
      dress.failedToEmbroider = false;
    }

    if (status === EmbroideryStatusEnum.Failed) {
      dress.failedToEmbroider = true;
      dress.isEmbroidered = false;
    }

    dress.embroideryStatus = status;

    return this.dressService.changeEmbroideryStatus(dress);
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
