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
import { AuthUser } from 'src/decorators';
import { DressService } from 'src/dress/dress.service';
import { TailorService } from 'src/tailor/tailor.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { UserService } from 'src/user/user.service';
import { CreateSticherDto } from './dto/create-sticher.dto';
import { UpdateSticherDto } from './dto/update-sticher.dto';
import { SticherService } from './sticher.service';
import { DressType } from 'src/dress/entities/dressType.entity';
import { WorkdetailService } from 'src/workdetail/workdetail.service';

@Controller()
export class SticherController {
  constructor(
    private readonly sticherService: SticherService,
    private readonly tailorService: TailorService,
    private readonly userService: UserService,
    private readonly dressService: DressService,
    private readonly workDetailService: WorkdetailService,
  ) {}

  @Post()
  async create(
    @Body() createSticherDto: CreateSticherDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    const dressType = await this.dressService.findByGivenDressType(
      createSticherDto.skills,
    );

    return this.sticherService.create({
      ...createSticherDto,
      skills: dressType,
      user: createUserDto as User,
    });
  }

  @Patch('send-request/work-with-tailor')
  @UseGuards(JwtAuthGuard)
  async sendRequestForWorkWithTailor(
    @AuthUser() user: User,
    @Query()
    {
      tailorId,
      workingHoursPerDay,
    }: { tailorId: number; workingHoursPerDay: number },
  ) {
    const sticher = await this.sticherService.findByUser(+user['id']);
    if (!tailorId || !workingHoursPerDay) {
      throw new BadRequestException(
        `${!tailorId ? 'Tailor is' : 'workingHours are '} required`,
      );
    }

    const tailor = await this.tailorService.findOne(+tailorId);
    return await this.workDetailService.addWorkingDetailWithTailor({
      tailor,
      sticher,
      workingHoursPerDay,
    });

    // const sticher = await this.userService.findOne(+user.id);
    // const sticher = await this.sticherService.addWorkingDetailWithTailor(
    //   +user?.id,
    //   +workingHoursPerDay,
    //   tailor,
    // );

    // if (!sticher) {
    //   throw new BadRequestException('Sticher Not Found');
    // }

    // tailor.sticher =
    //   tailor.sticher && tailor.sticher?.length > 0
    //     ? [
    //         ...tailor.sticher,
    //         {
    //           ...sticher,
    //           workingDetailWithTailor: sticher.workingDetailWithTailor.filter(
    //             (workDetail) => workDetail.tailor === tailor?.id,
    //           ),
    //         } as Sticher,
    //       ]
    //     : [
    //         {
    //           ...sticher,
    //           workingDetailWithTailor: sticher.workingDetailWithTailor.filter(
    //             (workDetail) => workDetail.tailor === tailor?.id,
    //           ),
    //         } as Sticher,
    //       ];

    // const updatedTailor = await this.tailorService.create(tailor);
    // if (updatedTailor) {
    //   throw new HttpException('Successfully Sent', 200);
    // }
  }

  @Patch('send-dress-to-tailor/stiched')
  @UseGuards(JwtAuthGuard)
  async sendStichedDressToTailor(
    @AuthUser() user: User,
    @Query('dressId') dressId: number,
  ) {
    if (!dressId) {
      throw new BadRequestException('Dress Id is required'!);
    }
    const dress = await this.dressService.findDressBySticherAndReturnToTailor(
      dressId,
      +user.id,
    );

    return dress;
  }

  @Patch('update-skills/sticher')
  @UseGuards(JwtAuthGuard)
  async updateSticherSkills(
    @AuthUser() user: User,
    @Query('skills') skills: string,
  ) {
    if (!skills) {
      throw new BadRequestException('Skills are Required!');
    }
    const newSkillsList: any = skills.split(',');

    const dressType = await this.dressService.findByGivenDressType(
      newSkillsList,
    );

    return this.sticherService.updateSticherSkills(+user.id, dressType);
  }

  @Get()
  findAll() {
    return this.sticherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sticherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSticherDto: UpdateSticherDto) {
    return this.sticherService.update(+id, updateSticherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sticherService.remove(+id);
  }

  @Delete('remove/all')
  removeAll() {
    return this.sticherService.removeAll();
  }
}
