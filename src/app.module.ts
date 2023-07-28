import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/entities/customer.entity';
import { DayerModule } from './dayer/dayer.module';
import { Dayer } from './dayer/entities/dayer.entity';
import { DressModule } from './dress/dress.module';
import { Dress } from './dress/entities/dress.entity';
import { EmbroiderModule } from './embroider/embroider.module';
import { Embroider } from './embroider/entities';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities';
import { Tailor } from './tailor/entities';
import { TailorModule } from './tailor/tailor.module';
import { User } from './user/entities';
import { UserModule } from './user/user.module';
import { SticherModule } from './sticher/sticher.module';
import { Sticher } from './sticher/entities/sticher.entity';
import { WorkingDetailWithTailor } from './sticher/entities/workDetail.entity';
import { DressType } from './dress/entities/dressType.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Dress,
          Dayer,
          Tailor,
          Sticher,
          Employee,
          Customer,
          DressType,
          Embroider,
          WorkingDetailWithTailor,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    EmployeesModule,
    EmbroiderModule,
    DayerModule,
    CustomerModule,
    AuthModule,
    DressModule,
    TailorModule,
    SticherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
