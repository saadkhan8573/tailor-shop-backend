import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TailorModule } from 'src/tailor/tailor.module';
import { WorkdetailModule } from 'src/workdetail/workdetail.module';
import { DresscutterController } from './dresscutter.controller';
import { DresscutterService } from './dresscutter.service';
import { Dresscutter } from './entities/dresscutter.entity';
import { DressModule } from 'src/dress/dress.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dresscutter]),
    forwardRef(() => TailorModule),
    forwardRef(() => WorkdetailModule),
    UserModule,
    DressModule,
  ],
  controllers: [DresscutterController],
  providers: [DresscutterService],
  exports: [DresscutterService],
})
export class DresscutterModule {}
