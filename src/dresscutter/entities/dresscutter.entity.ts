import { BaseEntity } from 'src/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { DressType } from 'src/dress/entities/dressType.entity';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { Tailor } from 'src/tailor/entities';
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

@Entity('dressCutter')
export class Dresscutter extends BaseEntity {
  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  dob: Date;

  @Column()
  gender: string;

  @ManyToMany(() => DressType, (dressType) => dressType.dressCutter)
 
  skills: DressType[];

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

  @OneToMany(() => Dress, (dress) => dress.dressCutter)
  dress: Dress[];

  @OneToMany(() => WorkDetail, (workDetail) => workDetail.dressCutter)
  workDetail: WorkDetail[];
}
