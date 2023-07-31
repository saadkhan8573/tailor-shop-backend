import { BaseEntity } from 'src/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Dress } from './dress.entity';
import { Sticher } from 'src/sticher/entities/sticher.entity';
import { Dresscutter } from 'src/dresscutter/entities/dresscutter.entity';

@Entity('dressType')
export class DressType extends BaseEntity {
  @Column()
  type: string;

  @OneToMany(() => Dress, (dress) => dress.dressType)
  dress: Dress[];

  @ManyToMany(() => Sticher, (sticher) => sticher.skills)
  @JoinTable()
  sticher: Sticher;

  @ManyToMany(() => Dresscutter, (dressCutter) => dressCutter.skills, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinTable()
  dressCutter: Dresscutter[];
}
