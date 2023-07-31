import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from 'src/customer/customer.module';
import { DayerModule } from 'src/dayer/dayer.module';
import { DressModule } from 'src/dress/dress.module';
import { DresscutterModule } from 'src/dresscutter/dresscutter.module';
import { EmbroiderModule } from 'src/embroider/embroider.module';
import { SticherModule } from 'src/sticher/sticher.module';
import { UserModule } from 'src/user/user.module';
import { WorkdetailModule } from 'src/workdetail/workdetail.module';
import { Tailor } from './entities';
import { TailorController } from './tailor.controller';
import { TailorService } from './tailor.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tailor]),
    forwardRef(() => CustomerModule),
    forwardRef(() => DressModule),
    forwardRef(() => EmbroiderModule),
    forwardRef(() => SticherModule),
    forwardRef(() => DresscutterModule),
    UserModule,
    AuthModule,
    DayerModule,
    WorkdetailModule,
  ],
  controllers: [TailorController],
  providers: [TailorService],
  exports: [TailorService],
})
export class TailorModule {}
