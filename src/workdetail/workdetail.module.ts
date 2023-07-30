import { Module, forwardRef } from '@nestjs/common';
import { WorkdetailService } from './workdetail.service';
import { WorkdetailController } from './workdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkDetail } from './entities/workdetail.entity';
import { SticherModule } from 'src/sticher/sticher.module';
import { DresscutterModule } from 'src/dresscutter/dresscutter.module';
import { DressModule } from 'src/dress/dress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkDetail]),
    forwardRef(() => SticherModule),
    forwardRef(() => DresscutterModule),
    DressModule,
  ],
  controllers: [WorkdetailController],
  providers: [WorkdetailService],
  exports: [WorkdetailService],
})
export class WorkdetailModule {}
