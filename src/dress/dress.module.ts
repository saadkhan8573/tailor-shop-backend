import { Module, forwardRef } from '@nestjs/common';
import { DressService } from './dress.service';
import { DressController } from './dress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dress } from './entities/dress.entity';
import { DayerModule } from 'src/dayer/dayer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dress]), forwardRef(() => DayerModule)],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService],
})
export class DressModule {}
