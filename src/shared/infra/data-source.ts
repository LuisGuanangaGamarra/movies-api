import { DataSource } from 'typeorm';
import * as path from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: ['error'],
  logger: 'file',
  entities: [
    path.resolve(__dirname, '../../**/infra/orm/*.orm-entity{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, `./migrations/*{.ts,.js}`)],
  migrationsTableName: 'migrations',
});
