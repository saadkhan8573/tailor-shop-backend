import { Module, forwardRef } from '@nestjs/common';
import { SticherService } from './sticher.service';
import { SticherController } from './sticher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticher } from './entities/sticher.entity';
import { TailorModule } from 'src/tailor/tailor.module';
import { UserModule } from 'src/user/user.module';
import { DressModule } from 'src/dress/dress.module';
import { WorkDetail } from 'src/workdetail/entities/workdetail.entity';
import { WorkdetailModule } from 'src/workdetail/workdetail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sticher, WorkDetail]),
    forwardRef(() => TailorModule),
    forwardRef(() => WorkdetailModule),
    UserModule,
    DressModule,
  ],
  controllers: [SticherController],
  providers: [SticherService],
  exports: [SticherService],
})
export class SticherModule {}
