import { BaseEntity } from 'src/base.entity';
import { Tailor } from 'src/tailor/entities';
import { UserStatus } from 'src/user/enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Sticher } from './sticher.entity';
import { Dress } from 'src/dress/entities/dress.entity';

@Entity({ name: 'workingDetailWithTailor' })
export class WorkingDetailWithTailor extends BaseEntity {
  @Column()
  workingHoursPerDay: number;
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @ManyToOne(() => Tailor, (tailor) => tailor.workingDetailWithTailor)
  @JoinColumn()
  tailor: Tailor;

  @ManyToOne(() => Sticher, (sticher) => sticher.workingDetailWithTailor)
  @JoinColumn()
  sticher: Sticher;

  @OneToMany(() => Dress, (dress) => dress.workDetail)
  dress: Dress[];
}
