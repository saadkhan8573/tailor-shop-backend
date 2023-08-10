import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DresscutterModule } from 'src/dresscutter/dresscutter.module';

@Module({
  imports: [DresscutterModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
