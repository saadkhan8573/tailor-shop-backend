import { BaseEntity } from 'src/base.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Dayer } from 'src/dayer/entities/dayer.entity';
import { Embroider } from 'src/embroider/entities';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { WorkingDetailWithTailor } from 'src/sticher/entities/workDetail.entity';
import { Tailor } from 'src/tailor/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DressStatusEnum, EmbroideryStatusEnum, PriorityEnum } from '../enum';
import { DyeStatusEnum } from '../enum/DyeStatusEnum';
import { DressType } from './dressType.entity';

@Entity()
export class Dress extends BaseEntity {
  @ManyToOne(() => DressType, (dressType) => dressType.dress, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  dressType: DressType;

  @Column({
    type: 'enum',
    nullable: true,
    enum: PriorityEnum,
    default: PriorityEnum.Low,
  })
  priority: PriorityEnum;

  @Column({
    type: 'enum',
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
  failedToDye: boolean;

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

  @ManyToOne(() => Embroider, (embroider) => embroider.dress, {
    nullable: true,
  })
  @JoinColumn()
  embroider: Embroider;

  @Column('boolean', { nullable: true })
  isSentForStiching: boolean;

  @Column('boolean', { nullable: true })
  isDressStiched: boolean;

  @Column('boolean', { nullable: true })
  isDressReturnedAfterStiching: boolean;

  @ManyToOne(() => Sticher, (sticher) => sticher.dress, { nullable: true })
  @JoinColumn()
  sticher: Sticher;

  @ManyToOne(() => WorkingDetailWithTailor, (workDetail) => workDetail.dress)
  @JoinColumn()
  workDetail: WorkingDetailWithTailor;
}
