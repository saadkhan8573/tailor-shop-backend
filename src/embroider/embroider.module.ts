import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TailorModule } from 'src/tailor/tailor.module';
import { EmbroiderController } from './embroider.controller';
import { EmbroiderService } from './embroider.service';
import { Embroider } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Embroider]), TailorModule],
  controllers: [EmbroiderController],
  providers: [EmbroiderService],
})
export class EmbroiderModule {}
