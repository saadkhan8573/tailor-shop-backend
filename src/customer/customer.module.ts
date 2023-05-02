import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TailorModule } from 'src/tailor/tailor.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { DressModule } from 'src/dress/dress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => TailorModule),
    forwardRef(() => DressModule),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
