import {
  BadRequestException,
  Body,
  ConflictException,
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
import { WorkdetailService } from 'src/workdetail/workdetail.service';
import { DresscutterService } from './dresscutter.service';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';
import { EmailVerificationGuard, UserApprovedStatusGaurd } from 'src/gaurds';
import { UserService } from 'src/user/user.service';
import { DressType } from 'src/dress/entities/dressType.entity';

@Controller()
export class DresscutterController {
  constructor(
    private readonly dresscutterService: DresscutterService,
    private readonly tailorService: TailorService,
    private readonly workDetailService: WorkdetailService,
    private readonly dressService: DressService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() createDresscutterDto: CreateDresscutterDto,
    @Body() cresteUserDto: CreateUserDto,
  ) {
    // const skills = await this.dressService.findByGivenDressType(
    //   createDresscutterDto.skills,
    // );

    const skills = createDresscutterDto.skills.map(
      (skill) =>
        ({
          id: +skill,
        } as DressType),
    );

    const user = await this.userService.findByEmailAndUserName(
      cresteUserDto.email,
      cresteUserDto.username,
    );

    if (user) {
      throw new BadRequestException(
        'User with this email or username already exists.',
      );
    }

    return this.dresscutterService.create({
      ...createDresscutterDto,
      skills,
      user: cresteUserDto as User,
    });
  }

  @Get()
  findAll() {
    return this.dresscutterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dresscutterService.findOne(+id);
  }

  @Patch('update-skills/dress-cutter')
  @UseGuards(JwtAuthGuard)
  async updateDressCutterSkills(
    @AuthUser() user: User,
    @Query('skills') skills: string,
  ) {
    if (!skills) {
      throw new BadRequestException('Skill are required!');
    }

    const convertedSkills = skills.split(',');

    const dressType = await this.dressService.findByGivenDressType(
      convertedSkills as any,
    );

    return this.dresscutterService.updateDressCutterSkills(+user.id, dressType);
  }

  @Patch('send-work-request/tailor')
  @UseGuards(JwtAuthGuard, EmailVerificationGuard, UserApprovedStatusGaurd)
  async sendWorkRequestToTailor(
    @AuthUser() user: User,
    @Query()
    {
      tailorId,
      workingHoursPerDay,
    }: { tailorId: number; workingHoursPerDay: number },
  ) {
    if (!tailorId) {
      throw new BadRequestException('Tailor is required');
    }

    const dressCutter = await this.dresscutterService.findByUser(+user.id);

    const tailor = await this.tailorService.findOne(+tailorId);

    const workDetail =
      await this.workDetailService.sendDressCutterRequestToTailor({
        dressCutterUserId: +user.id,
        workingHoursPerDay,
        tailor,
        dressCutter,
      });

    return workDetail;
  }

  @Get('my-work/requests')
  @UseGuards(JwtAuthGuard)
  async getMyWorRequests(@AuthUser() user: User) {
    return this.workDetailService.getDressCutterWorkRequests(+user.id);
  }

  @Get('my-work/requests/approved')
  @UseGuards(JwtAuthGuard)
  getMyApprovedWorkRequests(@AuthUser() user: User) {
    return this.workDetailService.getDressCutterApprovedWorkRequests(+user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDresscutterDto: UpdateDresscutterDto,
  ) {
    return this.dresscutterService.update(+id, updateDresscutterDto);
  }

  @Patch('dress-cutter/remove-skills')
  @UseGuards(JwtAuthGuard)
  removeMySkills(@AuthUser() user: User, @Query('skills') skills: string) {
    if (!skills) {
      throw new BadRequestException('Skills are required to delete!');
    }

    const updatedSkills = skills ? skills?.split(',') : [];

    return this.dresscutterService.removeMySkills(+user.id, updatedSkills);
  }

  @Get('find-my-dress/list')
  @UseGuards(JwtAuthGuard)
  async findMyDress(@AuthUser() user: User, @Query('dress') dress: string) {
    const updatedDress = dress ? dress.split(',') : [];
    return this.dresscutterService.findMyDress(+user.id, updatedDress);
  }

  @Get('filter-dress-cutter/list')
  @UseGuards(JwtAuthGuard)
  async filterDressCutter(
    @Query()
    {
      sticher,
      dress,
      tailor,
      customer,
      skills,
    }: {
      sticher: number;
      dress: number;
      tailor: number;
      customer: number;
      skills: number;
    },
  ) {
    return this.dresscutterService.filterDressCutter(
      sticher,
      dress,
      tailor,
      customer,
      skills,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dresscutterService.remove(+id);
  }
}
