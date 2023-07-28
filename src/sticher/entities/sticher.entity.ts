import { BaseEntity } from 'src/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dress } from 'src/dress/entities/dress.entity';
import { DressType } from 'src/dress/entities/dressType.entity';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';
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

@Entity({ name: 'sticher' })
export class Sticher extends BaseEntity {
  @Column()
  address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  dob: Date;

  @ManyToMany(() => DressType, (dressType) => dressType.sticher, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  skills: DressType[];

  @OneToOne(() => User, (user) => user.sticher, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Customer, (customer) => customer.sticher, {
    nullable: true,
  })
  @JoinTable()
  customer: Customer[];

  @ManyToMany(() => Tailor, (tailor) => tailor.sticher, {
    nullable: true,
  })
  @JoinTable()
  tailor: Tailor[];

  @OneToMany(
    () => WorkDetail,
    (workingDetailWithTailor) => workingDetailWithTailor.sticher,
    { nullable: true },
  )
  workingDetailWithTailor: WorkDetail[];

  // @Column('jsonb', { nullable: true, default: [] })
  // workingDetailWithTailor: WorkingDetailWithTailor[];

  @OneToMany(() => Dress, (dress) => dress.sticher)
  dress: Dress[];

  @ManyToMany(() => Dresscutter, (dresscutter) => dresscutter.sticher, {
    nullable: true,
  })
  dressCutter: Tailor[];

  // @BeforeInsert()
  // updateCreatedAt() {
  //   this.workingDetailWithTailor.forEach((item) => {
  //     if (!item.createdAt) {
  //       item.createdAt = new Date();
  //     }
  //     if (!item.id) {
  //       item.id = this.workingDetailWithTailor?.length; // You can implement this method to generate unique IDs.
  //     }
  //   });
  // }

  // @BeforeUpdate()
  // updateUpdatedAt() {
  //   this.workingDetailWithTailor.forEach((item) => {
  //     if (!item.createdAt) {
  //       item.createdAt = new Date();
  //     }
  //     if (!item.id) {
  //       item.id = this.workingDetailWithTailor?.length; // You can implement this method to generate unique IDs.
  //     }
  //     item.updatedAt = new Date();
  //   });
  // }
}
