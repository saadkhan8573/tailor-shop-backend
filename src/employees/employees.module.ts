import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities';
import { UserModule } from 'src/user/user.module';
import { TailorModule } from 'src/tailor/tailor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), UserModule, TailorModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
