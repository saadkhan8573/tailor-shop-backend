import { Module, forwardRef } from '@nestjs/common';
import { SticherService } from './sticher.service';
import { SticherController } from './sticher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sticher } from './entities/sticher.entity';
import { TailorModule } from 'src/tailor/tailor.module';
import { UserModule } from 'src/user/user.module';
import { WorkingDetailWithTailor } from './entities/workDetail.entity';
import { DressModule } from 'src/dress/dress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sticher, WorkingDetailWithTailor]),
    forwardRef(() => TailorModule),
    UserModule,
    DressModule,
  ],
  controllers: [SticherController],
  providers: [SticherService],
  exports: [SticherService],
})
export class SticherModule {}
