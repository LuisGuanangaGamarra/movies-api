import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @ManyToOne(() => RoleOrmEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;
}
