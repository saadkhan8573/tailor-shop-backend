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
import { Query, UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthUser } from 'src/decorators';
import { User } from './entities';
import { UserStatus } from './enum';
import { Roles } from 'src/gaurds/RoleBaseGaurd.gaurd';
import { UserRole } from 'src/constants';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('verify/email/:token')
  async verifyUserEmailwithToken(@Param('token') token: string) {
    return this.userService.verifyUserEmailwithToken(token);
  }

  @Patch('send-email-verification-token/email')
  @UseGuards(JwtAuthGuard)
  async sendEmailVerificationLink(@AuthUser() user: User) {
    if (user.isEmailVerified) {
      throw new BadRequestException('Your email is already verified!');
    }
    return this.userService.sendEmailVerificationLink(user);
  }

  @Patch('user-status/update')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async updateUserStatus(
    @Query() { userId, status }: { userId: number; status: UserStatus },
  ) {
    if (!userId) {
      throw new BadRequestException('User is required!');
    }

    if (!status) {
      throw new BadRequestException('Status is required!');
    }

    return await this.userService.updateUserStatus(userId, status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Delete('remove/all')
  removeAll() {
    return this.userService.removeAllUser();
  }
}
