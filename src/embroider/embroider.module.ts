import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TailorModule } from 'src/tailor/tailor.module';
import { EmbroiderController } from './embroider.controller';
import { EmbroiderService } from './embroider.service';
import { Embroider } from './entities';
import { DressModule } from 'src/dress/dress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Embroider]),
    forwardRef(() => TailorModule),
    forwardRef(() => DressModule),
  ],
  controllers: [EmbroiderController],
  providers: [EmbroiderService],
  exports: [EmbroiderService],
})
export class EmbroiderModule {}
