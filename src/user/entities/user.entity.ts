import { UserRole } from 'src/constants';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Embroider } from 'src/embroider/entities';
import { Employee } from 'src/employees/entities';
import { Tailor } from 'src/tailor/entities';

import { BaseEntity } from 'src/base.entity';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { Column, Entity, Index, OneToOne } from 'typeorm';
import { UserStatus } from '../enum';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  avatar: string;
  @Column()
  name: string;

  @Column({ nullable: false, unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ name: 'username', nullable: false, default: '', unique: true })
  @Index({ unique: true })
  username: string;

  @Column({ nullable: true, default: false })
  isEmailVerified: boolean;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Tailor,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: string;

  @OneToOne(() => Tailor, (tailor) => tailor.user, { nullable: true })
  tailor: Tailor;

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  employee: Employee;

  @OneToOne(() => Embroider, (embroider) => embroider.user, { nullable: true })
  embroider: Embroider;

  @OneToOne(() => Customer, (customer) => customer.user, { nullable: true })
  customer: Customer;

  @OneToOne(() => Dayer, (dayer) => dayer.user, { nullable: true })
  dayer: Dayer;

  @OneToOne(() => Sticher, (sticher) => sticher.user, { nullable: true })
  sticher: Sticher;

  @OneToOne(() => Dresscutter, (dresscutter) => dresscutter.user)
  dressCutter: Dresscutter;
}
