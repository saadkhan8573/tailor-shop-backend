import { BaseEntity } from 'src/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';
import { Embroider } from 'src/embroider/entities';
import { Employee } from 'src/employees/entities';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { User } from 'src/user/entities';
import { WorkDetail } from 'src/workdetail/entities/workdetail.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Tailor extends BaseEntity {
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  gender: string;

  @OneToOne(() => User, (user) => user.tailor, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Employee, (employee) => employee.tailor, { nullable: true })
  employee: Employee;

  @OneToMany(() => Embroider, (embroider) => embroider.tailor, {
    nullable: true,
  })
  embroider: Embroider;

  @ManyToMany(() => Customer, (customer) => customer.tailor, { nullable: true })
  @JoinTable()
  customer: Customer[];

  @ManyToMany(() => Dayer, (dayer) => dayer.tailor, { nullable: true })
  @JoinTable()
  dayer: Dayer[];

  @OneToMany(() => Dress, (dress) => dress.tailor, { nullable: true })
  dress: Dress;

  @ManyToMany(() => Sticher, (sticher) => sticher.tailor, { nullable: true })
  sticher: Sticher[];

  @OneToMany(
    () => WorkDetail,
    (workingDetailWithTailor) => workingDetailWithTailor.tailor,
    { nullable: true },
  )
  workingDetailWithTailor: WorkDetail[];

  @ManyToMany(() => Dresscutter, (dressCutter) => dressCutter.tailor)
  dressCutter: Dresscutter;
}
