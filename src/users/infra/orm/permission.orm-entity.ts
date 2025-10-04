import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
