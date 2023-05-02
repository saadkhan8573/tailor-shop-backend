import { Module, forwardRef } from '@nestjs/common';
import { TailorService } from './tailor.service';
import { TailorController } from './tailor.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';
import { DressModule } from 'src/dress/dress.module';
import { Tailor } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayerModule } from 'src/dayer/dayer.module';
import { EmbroiderModule } from 'src/embroider/embroider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tailor]),
    forwardRef(() => CustomerModule),
    forwardRef(() => DressModule),
    forwardRef(() => EmbroiderModule),
    
    UserModule,
    DayerModule,
  ],
  controllers: [TailorController],
  providers: [TailorService],
  exports: [TailorService],
})
export class TailorModule {}
