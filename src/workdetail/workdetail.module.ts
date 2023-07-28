import { Module, forwardRef } from '@nestjs/common';
import { WorkdetailService } from './workdetail.service';
import { WorkdetailController } from './workdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkDetail } from './entities/workdetail.entity';
import { SticherModule } from 'src/sticher/sticher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkDetail]),
    forwardRef(() => SticherModule),
  ],
  controllers: [WorkdetailController],
  providers: [WorkdetailService],
  exports: [WorkdetailService],
})
export class WorkdetailModule {}
