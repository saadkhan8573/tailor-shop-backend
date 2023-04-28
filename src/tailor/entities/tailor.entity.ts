import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Embroider } from 'src/embroider/entities';
import { Employee } from 'src/employees/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Tailor {
  @PrimaryGeneratedColumn()
  id: number;

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
}
