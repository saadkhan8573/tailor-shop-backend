import { BaseEntity } from 'src/base.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customer extends BaseEntity {
  @Column()
  phone: string;

  @Column({ nullable: true })
  dob: Date;

  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @OneToOne(() => User, (user) => user.customer, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Tailor, (tailor) => tailor.customer, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  tailor: Tailor[];

  @ManyToMany(() => Dayer, (dayer) => dayer.customer, { nullable: true })
  dayer: Dayer[];

  @OneToMany(() => Dress, (dress) => dress.customer)
  dress: Dress;

  @ManyToMany(() => Sticher, (sticher) => sticher.customer, { nullable: true })
  sticher: Sticher[];

  @ManyToMany(() => Dresscutter, (dressCutter) => dressCutter.customer)
  dressCutter: Dresscutter[];
}
