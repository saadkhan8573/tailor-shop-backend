import { Tailor } from 'src/tailor/entities';
import { User } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Embroider {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => User, (user) => user.embroider, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'insert', 'remove'],
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Tailor, (tailor) => tailor.embroider)
  @JoinColumn()
  tailor: Tailor;
}
