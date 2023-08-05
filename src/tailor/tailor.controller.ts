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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/constants';
import { CustomerService } from 'src/customer/customer.service';
import { DayerService } from 'src/dayer/dayer.service';
import { AuthUser } from 'src/decorators';
import { DressService } from 'src/dress/dress.service';
import {
  DressStatusEnum,
  DyeStatusEnum,
  EmbroideryStatusEnum,
} from 'src/dress/enum';
import { DresscutterService } from 'src/dresscutter/dresscutter.service';
import { EmbroiderService } from 'src/embroider/embroider.service';
import { EmailVerificationGuard, UserApprovedStatusGaurd } from 'src/gaurds';
import { Roles, RolesGuard } from 'src/gaurds/RoleBaseGaurd.gaurd';
import { UserId } from 'src/gaurds/setMetatdataForUserId.gaurd';
import { SticherService } from 'src/sticher/sticher.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { UserStatus } from 'src/user/enum';
import { UserService } from 'src/user/user.service';
import { WorkdetailService } from 'src/workdetail/workdetail.service';
import { CreateTailorDto } from './dto/create-tailor.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';
import { TailorService } from './tailor.service';
import { DataSource, Repository, Transaction } from 'typeorm';
import { Dress } from 'src/dress/entities/dress.entity';
import { WorkDetail } from 'src/workdetail/entities/workdetail.entity';

@Controller()
export class TailorController {
  constructor(
    private dataSource: DataSource,
    private readonly userService: UserService,
    private readonly dressService: DressService,
    private readonly dayerService: DayerService,
    private readonly tailorService: TailorService,
    private readonly sticherService: SticherService,
    private readonly customerService: CustomerService,
    private readonly embroiderService: EmbroiderService,
    private readonly workDetailService: WorkdetailService,
    private readonly dressCutterService: DresscutterService,
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
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Tailor)
  async transferDressForDye(
    @AuthUser() user: any,
    @Query() { dressId, dayerId }: { dressId: number; dayerId: number },
  ) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }

    const dress = await this.dressService.findOne(dressId);

    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }

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
      if (dress.failedToDye) {
        throw new BadRequestException('Dayer has failed to dye');
      }
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
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
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
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  findForDyeDress(@AuthUser() user: User) {
    return this.dressService.findForDyeDress(user?.id);
  }

  @Get('dress/find-by-dye-status')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
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

  @Get('dress/find-dress-for-dye/list')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  findDressForDyeList(@AuthUser() user: User, @Query('isDye') isDye: string) {
    return this.dressService.findDressForDyeList(user?.id, isDye);
  }

  @Get('dress/find-dress-for-embroidery/list')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  findDressForEmbroideryList(
    @AuthUser() user: User,
    @Query('isEmbroidery') isEmbroidery: string,
  ) {
    return this.dressService.findDressForEmbroideryList(user?.id, isEmbroidery);
  }

  @Patch('dress/transfer-dress-for-stiching')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  async transferDressForStiching(
    @AuthUser() user: User,
    @Query() { dressId, sticherId }: { dressId: number; sticherId: number },
  ) {
    const dress = await this.dressService.findOneByTailor(dressId, user?.id);

    if (!dress) {
      throw new BadRequestException('Dress Not Found');
    }
    return null;
  }

  @Get()
  findAll() {
    return this.tailorService.findAll();
  }

  @Get('find-customer-by-owner/list')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
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
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  async findDressByOwner(@AuthUser() user: User) {
    const isUser = await this.userService.findOne(+user.id);
    if (!isUser) {
      throw new BadRequestException('User Not Found, Try Login');
    }
    const tailor = await this.userService.findOneAndSelectProfiles(+user.id);
    return await this.dressService.findDressByOwner(+tailor.tailor.id);
  }

  @Get('find-customers-and-dress/list')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
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

    if (!id) {
      throw new BadRequestException('Dress Id is required');
    }

    return this.dressService.changeDressStatus(id, status);
  }

  @Patch('change-sticher-status/work-detail')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  async changeSticherWorkDetailStatus(
    @AuthUser() user: User,
    @Query()
    { status, workDetailId }: { status: UserStatus; workDetailId: number },
  ) {
    if (!workDetailId) {
      throw new BadRequestException('Work Detail Id is required');
    }

    const workDetail =
      await this.workDetailService.findWorkDetailAndStatusUpdate(
        +workDetailId,
        status,
        +user?.id,
      );

    return status === UserStatus.APPROVED
      ? this.tailorService.updateTailorSticher(+user?.id, workDetail.sticher)
      : [UserStatus.BLOCKED, UserStatus.REJECTED].includes(status)
      ? this.tailorService.removeSticherFromTailor(
          workDetail.sticher.id,
          +user?.id,
        )
      : workDetail;
  }

  @Patch('send-dress-for-stiching/sticher')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  async sendDressForStiching(
    @AuthUser() user: User,
    @Query()
    {
      sticherWorkDetailId,
      dressId,
    }: { sticherWorkDetailId: number; dressId: number },
  ) {
    if (!sticherWorkDetailId || !dressId) {
      throw new BadRequestException(
        `${
          !sticherWorkDetailId ? 'Sticher' : !dressId ? 'Dress' : ''
        } Id is required`,
      );
    }

    const sticher = await this.sticherService.findSticherByWorkDetail(
      +sticherWorkDetailId,
    );

    const dress = await this.dressService.findDressByTailorAndChangeDressStatus(
      dressId,
      +user?.id,
      DressStatusEnum.InProgress,
      sticher,
    );

    const workDetail = await this.sticherService.sendDressToSticher(
      dress,
      sticherWorkDetailId,
      +user.id,
    );
    return workDetail;
  }

  @Patch('change-dress-cutter-status/work-detail')
  @UseGuards(UserApprovedStatusGaurd)
  @UseGuards(EmailVerificationGuard)
  @UseGuards(JwtAuthGuard)
  async changeTailorWorkDetailStatus(
    @AuthUser() user: User,
    @Query()
    { status, workDetailId }: { workDetailId: number; status: UserStatus },
  ) {
    if (!workDetailId) {
      throw new BadRequestException('WorkDetail is required');
    }

    if (!status) {
      throw new BadRequestException('Status is required');
    }
    const workDetail =
      await this.workDetailService.changeTailorWorkDetailStatus(
        +workDetailId,
        +user.id,
        status,
      );

    await this.tailorService.updateTailorDressCutterStatus(
      +user?.id,
      workDetail.dressCutter,
      status,
    );

    return workDetail;
  }

  // @Transaction()
  @Patch('send-dress-for-cutting/dress-cutter')
  // @Roles(UserRole.Tailor)
  @UseGuards(JwtAuthGuard)
  async sendDressForCutting(
    @AuthUser() user: User,
    @Query()
    { dressId, workDetailId }: { dressId: number; workDetailId: number },
  ) {
    let workDetail = null;

    // await this.dataSource.manager.transaction(
    //   async (transactionalEntityManager) => {
    //     await transactionalEntityManager.save(Dress);
    //     // await transactionalEntityManager.save(WorkDetail);
    //     // ...
    //   },
    // );

    const queryRunner = this.dataSource.createQueryRunner();
    const dress = await queryRunner.manager.find(Dress);
    const workDetails = await queryRunner.manager.find(WorkDetail);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!workDetailId) {
        throw new BadRequestException('Work Detail is required');
      }

      if (!dressId) {
        throw new BadRequestException('Dress is required!');
      }

      const dress =
        await this.dressService.finDressByTailorAndUpdateCuttingStatus(
          +dressId,
          +user.id,
        );

      workDetail = await this.workDetailService.sendDressToDressCutter(
        +workDetailId,
        +user.id,
        dress,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    if (!workDetail) {
      await queryRunner.rollbackTransaction();
    }

    return workDetail;
  }

  @Get(':id')
  // @UseGuards(AuthorizationGuard)
  // @UseGuards(UserApprovedStatusGaurd)
  // @UseGuards(EmailVerificationGuard)
  // @UseGuards(JwtAuthGuard)
  @UserId(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Tailor Does not exist or removed');
    }
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
