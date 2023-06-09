import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TailorService } from './tailor.service';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { UserService } from 'src/user/user.service';
import { CustomerService } from 'src/customer/customer.service';
import { DressService } from 'src/dress/dress.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators';
import { DayerService } from 'src/dayer/dayer.service';
import { Dress } from 'src/dress/entities/dress.entity';
import {
  DressStatusEnum,
  DyeStatusEnum,
  EmbroideryStatusEnum,
} from 'src/dress/enum';
import { User } from 'src/user/entities';
import { EmbroiderService } from 'src/embroider/embroider.service';

@Controller('tailor')
export class TailorController {
  constructor(
    private readonly tailorService: TailorService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly dressService: DressService,
    private readonly dayerService: DayerService,
    private readonly embroiderService: EmbroiderService,
  ) {}

  @Post()
  async create(
    @Body() createTailorDto: CreateTailorDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    const user = await this.userService.create(createUserDto);

    if (!user) {
      throw new BadRequestException('User is required');
    }

    return this.tailorService.create({
      ...createTailorDto,
      user,
    });
  }

  @Patch('transfer-dress/dye')
  @UseGuards(JwtAuthGuard)
  async transferDressForDye(
    @AuthUser() user: any,
    @Query() { dressId, dayerId }: { dressId: number; dayerId: number },
  ) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }

    const dress = await this.dressService.findOne(dressId);

    if (
      dress.dyeStatus !== DyeStatusEnum.NotSent &&
      dress.dyeStatus !== DyeStatusEnum.Returned
    ) {
      throw new BadRequestException('You already sent this dress to dayer');
    }
    if (dress.dyeStatus === DyeStatusEnum.Returned) {
      if (dress.isDyed) {
        throw new BadRequestException('Dayer is already Dyed');
      }
      if (dress.faiedToDye) {
        throw new BadRequestException('Dayer has failed to dye');
      }
    }

    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }

    if (!dress.isDye) {
      throw new BadRequestException('Dress is not for dye');
    }

    const dayer = await this.dayerService.findOne(dayerId);

    if (!dayer) {
      throw new BadRequestException('Dayer Not Found');
    }

    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);

    dress.dyeStatus = DyeStatusEnum.Sent;
    await this.dressService.changeDyeStatus(dress);
    // const dayerDress = dayer.dress?.map((dress: Dress) => dress.id);

    // if (dayerDress.includes(dress.id)) {
    //   throw new BadRequestException('You already sent this dress to dayer');
    // }

    return this.dressService.transferDressForDye({
      dress,
      dayer,
      tailor,
    });
  }

  @Patch('transfer-dress/embroidery')
  @UseGuards(JwtAuthGuard)
  async transferDressForEmbroidery(
    @AuthUser() user: any,
    @Query() { dressId, embroiderId }: { dressId: number; embroiderId: number },
  ) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }

    if (!dressId) {
      throw new BadRequestException('Dress Id is required!');
    }

    const dressDayingStatus = [DyeStatusEnum.NotSent, DyeStatusEnum.Returned];
    const dress = await this.dressService.findOne(dressId);

    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }

    if (!dress.isEmbroidery) {
      throw new BadRequestException('Dress is not for Embroidery');
    }

    if (!dressDayingStatus.includes(dress.dyeStatus)) {
      throw new BadRequestException(
        'Dress Cant send for embroidery, its already sent to dayer for daying',
      );
    }

    if (
      dress.embroideryStatus !== EmbroideryStatusEnum.NotSent &&
      dress.embroideryStatus !== EmbroideryStatusEnum.Returned
    ) {
      throw new BadRequestException(
        'You already sent this dress to embroidery',
      );
    }

    if (dress.isEmbroidered) {
      throw new BadRequestException('Embroider already done his job');
    }

    if (!embroiderId) {
      throw new BadRequestException('Embroider Id is required!');
    }

    const embroider = await this.embroiderService.findOne(+embroiderId);

    if (!embroider) {
      throw new BadRequestException('Embroider not found!');
    }

    // const dayer = await this.dayerService.findOne(dayerId);

    // if (!dayer) {
    //   throw new BadRequestException('Dayer Not Found');
    // }

    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);

    if (!tailor) {
      throw new BadRequestException('Tailor Not Found');
    }

    dress.embroideryStatus = EmbroideryStatusEnum.Sent;
    await this.dressService.changeDyeStatus(dress);

    // if (dayerDress.includes(dress.id)) {
    //   throw new BadRequestException('You already sent this dress to dayer');
    // }

    return this.dressService.transferDressForEmbroidery({
      dress,
      embroider,
      tailor,
    });
  }

  @Get('dress/find-for-dye-dress')
  @UseGuards(JwtAuthGuard)
  findForDyeDress(@AuthUser() user: User) {
    return this.dressService.findForDyeDress(user?.id);
  }

  @Get('dress/find-by-dye-status')
  @UseGuards(JwtAuthGuard)
  findByDyeStatus(
    @AuthUser() user: User,
    @Query('dyeStatus') dyeStatus: DyeStatusEnum,
  ) {
    if (!dyeStatus) {
      throw new BadRequestException('No Dye Status was found!');
    }
    return this.dressService.findByDyeStatus(user?.id, dyeStatus);
  }

  @Get()
  findAll() {
    return this.tailorService.findAll();
  }

  @Get('find-customer-by-owner/list')
  @UseGuards(JwtAuthGuard)
  async findCustomerByOwner(@AuthUser() user: any) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }
    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);

    return await this.customerService.findCustomerByOwner(+tailor.tailor.id);
  }

  @Get('find-dress-by-owner/list')
  @UseGuards(JwtAuthGuard)
  async findDressByOwner(@AuthUser() user: any) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }
    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);
    return await this.dressService.findDressByOwner(+tailor.tailor.id);
  }

  @Get('find-customers-and-dress/list')
  @UseGuards(JwtAuthGuard)
  async findCustomersAndDress(@AuthUser() user: any) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }
    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);
    return await this.customerService.findCustomersAndDress(+tailor.tailor.id);
  }

  @Patch('change-status/dress/:id')
  async changeDressStatus(
    @Param('id') id: number,
    @Query('status') status: DressStatusEnum,
  ) {
    if (!status) {
      throw new BadRequestException('Status is required!');
    }
    const dress = await this.dressService.findOne(id);

    if (!dress) {
      throw new BadRequestException('Dress Not Fount');
    }

    dress.status = status;
    return this.dressService.changeDressStatus(id, dress);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tailorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTailorDto: UpdateTailorDto) {
    return this.tailorService.update(+id, updateTailorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tailorService.remove(+id);
  }

  @Delete('remove/all')
  removeAll() {
    return this.tailorService.removeAllOwner();
  }
}
