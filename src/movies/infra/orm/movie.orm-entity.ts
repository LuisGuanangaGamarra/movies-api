import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movies')
export class MovieOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  director: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'text' })
  synopsis: string;

  @Column({ type: 'varchar', name: 'external_id', length: 100, nullable: true })
  externalId?: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true, name: 'updated_at' })
  updatedAt: Date;
}
