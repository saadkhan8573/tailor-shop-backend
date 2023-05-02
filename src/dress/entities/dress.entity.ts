import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Tailor } from 'src/tailor/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  DressEnum,
  PriorityEnum,
  DressStatusEnum,
  EmbroideryStatusEnum,
} from '../enum';
import { DyeStatusEnum } from '../enum/DyeStatusEnum';

@Entity()
export class Dress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    nullable: true,
    enum: DressEnum,
    default: DressEnum.Simple,
  })
  dresstype: DressEnum;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PriorityEnum,
    default: PriorityEnum.Low,
  })
  priority: PriorityEnum;

  @Column({
    type: 'enum',
    nullable: true,
    enum: EmbroideryStatusEnum,
    default: EmbroideryStatusEnum.NotSent,
  })
  embroideryStatus: EmbroideryStatusEnum;

  @Column('boolean', { default: false })
  isEmbroidered: boolean;

  @Column('boolean', { default: false })
  failedToEmbroider: boolean;

  @Column({
    type: 'enum',
    nullable: true,
    enum: DressStatusEnum,
    default: DressStatusEnum.Incomplete,
  })
  status: DressStatusEnum;

  @Column('boolean', { default: false })
  isDye: boolean;

  @Column('boolean', { default: false })
  isEmbroidery: boolean;

  @ManyToOne(() => Customer, (customer) => customer.dress, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  customer: Customer;

  @Column('boolean', { default: false })
  sentForDye: boolean;

  @Column('boolean', { default: false })
  isDyed: boolean;

  @Column('boolean', { default: false })
  faiedToDye: boolean;

  @Column({
    type: 'enum',
    enum: DyeStatusEnum,
    default: DyeStatusEnum.NotSent,
  })
  dyeStatus: DyeStatusEnum;

  @ManyToOne(() => Tailor, (tailor) => tailor.dress, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  tailor: Tailor;

  @ManyToOne(() => Dayer, (dayer) => dayer.dress, { nullable: true })
  @JoinColumn()
  dayer: Dayer;
}
