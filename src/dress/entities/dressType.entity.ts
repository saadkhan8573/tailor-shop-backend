import { BaseEntity } from 'src/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Dress } from './dress.entity';

@Entity('dressType')
export class DressType extends BaseEntity {
  @Column()
  type: string;

  @OneToMany(() => Dress, (dress) => dress.dressType)
  dress: Dress[];
}
