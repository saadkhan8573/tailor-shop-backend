import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { RouterModule } from '@nestjs/core';
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
import { DressType } from './dress/entities/dressType.entity';
import { DresscutterModule } from './dresscutter/dresscutter.module';
import { Dresscutter } from './dresscutter/entities/dresscutter.entity';
import { EmbroiderModule } from './embroider/embroider.module';
import { Embroider } from './embroider/entities';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities';
import { MailModule } from './mail/mail.module';
import { Sticher } from './sticher/entities/sticher.entity';
import { SticherModule } from './sticher/sticher.module';
import { Tailor } from './tailor/entities';
import { TailorModule } from './tailor/tailor.module';
import { User } from './user/entities';
import { UserModule } from './user/user.module';
import { WorkDetail } from './workdetail/entities/workdetail.entity';
import { WorkdetailModule } from './workdetail/workdetail.module';
import { AdminModule } from './admin/admin.module';

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
          WorkDetail,
          Dresscutter,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MailModule,
    DayerModule,
    DressModule,
    TailorModule,
    SticherModule,
    CustomerModule,
    EmployeesModule,
    EmbroiderModule,
    WorkdetailModule,
    DresscutterModule,
    RouterModule.register([
      {
        path: 'tailor',
        module: TailorModule,
      },
      {
        path: 'sticher',
        module: SticherModule,
      },
      {
        path: 'dresscutter',
        module: DresscutterModule,
      },
      {
        path: 'employees',
        module: EmployeesModule,
      },
      {
        path: 'user',
        module: UserModule,
      },
    ]),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
