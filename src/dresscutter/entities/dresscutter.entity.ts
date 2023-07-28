import { BaseEntity } from 'src/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Sticher } from 'src/sticher/entities/sticher.entity';
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
} from 'typeorm';

@Entity()
export class Dresscutter extends BaseEntity {
  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @OneToOne(() => User, (user) => user.dressCutter, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Sticher, (sticher) => sticher.dressCutter, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable()
  sticher: Sticher[];

  @ManyToMany(() => Tailor, (tailor) => tailor.dressCutter, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable()
  tailor: Tailor[];

  @ManyToMany(() => Customer, (customer) => customer.dressCutter, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinTable()
  customer: Customer[];

  @OneToMany(() => Dress, (dress) => dress.dressCutter, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  dress: Dress;
}
