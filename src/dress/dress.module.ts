import { Module, forwardRef } from '@nestjs/common';
import { DressService } from './dress.service';
import { DressController } from './dress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dress } from './entities/dress.entity';
import { DayerModule } from 'src/dayer/dayer.module';
import { TailorModule } from 'src/tailor/tailor.module';
import { CustomerModule } from 'src/customer/customer.module';
import { EmbroiderModule } from 'src/embroider/embroider.module';
import { DressType } from './entities/dressType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dress, DressType]),
    forwardRef(() => DayerModule),
    forwardRef(() => TailorModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => EmbroiderModule),
  ],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService],
})
export class DressModule {}
