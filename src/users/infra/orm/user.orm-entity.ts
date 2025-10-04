import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 320 })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @ManyToOne(() => RoleOrmEntity, { lazy: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;
}
