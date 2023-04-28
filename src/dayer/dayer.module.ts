import { Module, forwardRef } from '@nestjs/common';
import { DayerService } from './dayer.service';
import { DayerController } from './dayer.controller';
import { Dayer } from './entities/dayer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DressModule } from 'src/dress/dress.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dayer]), forwardRef(() => DressModule)],
  controllers: [DayerController],
  providers: [DayerService],
  exports: [DayerService],
})
export class DayerModule {}
