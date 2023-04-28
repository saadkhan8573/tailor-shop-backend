import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Dayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @ManyToMany(() => User)
  @JoinTable()
  dressPickedFrom: User[];

  @OneToOne(() => User, (user) => user.dayer, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Tailor, (tailor) => tailor.dayer, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
    nullable: true,
  })
  tailor: Tailor[];

  @ManyToMany(() => Customer, (customer) => customer.dayer, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
    nullable: true,
  })
  customer: Customer[];

  @OneToMany(() => Dress, (dress) => dress.dayer, {
    nullable: true,
  })
  dress: Dress[];
}
