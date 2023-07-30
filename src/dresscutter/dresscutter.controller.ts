import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DresscutterService } from './dresscutter.service';
import { CreateDresscutterDto } from './dto/create-dresscutter.dto';
import { UpdateDresscutterDto } from './dto/update-dresscutter.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators';
import { TailorService } from 'src/tailor/tailor.service';
import { WorkdetailService } from 'src/workdetail/workdetail.service';
import { DressService } from 'src/dress/dress.service';
import { DressType } from 'src/dress/entities/dressType.entity';

@Controller('dresscutter')
export class DresscutterController {
  constructor(
    private readonly dresscutterService: DresscutterService,
    private readonly tailorService: TailorService,
    private readonly workDetailService: WorkdetailService,
    private readonly dressService: DressService,
  ) {}

  @Post()
  create(
    @Body() createDresscutterDto: CreateDresscutterDto,
    @Body() cresteUserDto: CreateUserDto,
  ) {
    return this.dresscutterService.create({
      ...createDresscutterDto,
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
  @UseGuards(JwtAuthGuard)
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dresscutterService.remove(+id);
  }
}