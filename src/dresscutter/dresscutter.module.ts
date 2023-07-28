import { Module } from '@nestjs/common';
import { DresscutterService } from './dresscutter.service';
import { DresscutterController } from './dresscutter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dresscutter } from './entities/dresscutter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dresscutter])],
  controllers: [DresscutterController],
  providers: [DresscutterService],
})
export class DresscutterModule {}
