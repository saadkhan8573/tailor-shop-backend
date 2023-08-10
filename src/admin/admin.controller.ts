import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DresscutterService } from 'src/dresscutter/dresscutter.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EmailVerificationGuard, UserApprovedStatusGaurd } from 'src/gaurds';
import { Roles } from 'src/gaurds/RoleBaseGaurd.gaurd';
import { UserRole } from 'src/constants';
import { Paginate } from 'src/decorators/pagination.decorator';
import { Pagination } from 'utils';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly dressCutterService: DresscutterService,
  ) {}

  @Get('get-dressCutter-by-work-detail')
  @UseGuards(JwtAuthGuard, EmailVerificationGuard, UserApprovedStatusGaurd)
  @Roles(UserRole.Admin)
  async getDressCutterByWorkDetail(@Paginate() pagination: Pagination) {
    return this.dressCutterService.getDressCutterByWorkDetail(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
