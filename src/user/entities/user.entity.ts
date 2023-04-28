import { UserRole } from 'src/constants';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Embroider } from 'src/embroider/entities';
import { Employee } from 'src/employees/entities';
import { Tailor } from 'src/tailor/entities';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStatus } from '../enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'email', nullable: false, default: '', unique: true })
  @Index({ unique: true })
  email: string;

  @Column({ name: 'username', nullable: false, default: '', unique: true })
  @Index({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Tailor,
  })
  role: string;

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
}
