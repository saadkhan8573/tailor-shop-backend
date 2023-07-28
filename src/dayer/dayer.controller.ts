import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DayerService } from './dayer.service';
import { CreateDayerDto } from './dto/create-dayer.dto';
import { UpdateDayerDto } from './dto/update-dayer.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { DyeStatusEnum } from 'src/dress/enum';
import { DressService } from 'src/dress/dress.service';

@Controller('dayer')
export class DayerController {
  constructor(
    private readonly dayerService: DayerService,
    private readonly dressService: DressService,
  ) {}

  @Post()
  create(
    @Body() createDayerDto: CreateDayerDto,
    @Body() createUserDta: CreateUserDto,
  ) {
    return this.dayerService.create({
      ...createDayerDto,
      user: createUserDta as User,
    });
  }

  @Get()
  findAll() {
    return this.dayerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dayerService.findOne(+id);
  }

  @Patch('dress-dye-status/:dressId')
  async changeDressDyeStatus(
    @Param('dressId') dressId: string,
    @Query() { dyeStatus }: { dyeStatus: DyeStatusEnum },
  ) {
    if (!dressId) {
      throw new BadRequestException('Dress Id was not found');
    }
    const dress = await this.dressService.findOne(+dressId);
    if (!dress) {
      throw new BadRequestException('Dress not found');
    }
    if (dyeStatus === DyeStatusEnum.Dyed) {
      dress.isDyed = true;
      dress.failedToDye = false;
    }

    if (dyeStatus === DyeStatusEnum.FailedToDye) {
      dress.failedToDye = true;
      dress.isDyed = false;
    }
    dress.dyeStatus = dyeStatus;
    return this.dressService.changeDyeStatus(dress);
    // return this.dayerService.update(+id, updateDayerDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDayerDto: UpdateDayerDto) {
    return this.dayerService.update(+id, updateDayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayerService.remove(+id);
  }
}
