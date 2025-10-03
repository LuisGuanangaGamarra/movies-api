import { DataSource } from 'typeorm';
import * as path from 'path';

const isCompiled = path.extname(__filename) === '.js';

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
    path.join(
      __dirname,
      `../../**/**/infra/orm-entities/*${isCompiled ? '.js' : '.ts'}`,
    ),
  ],
  migrations: [
    path.join(__dirname, `./migrations/*${isCompiled ? '.js' : '.ts'}`),
  ],
  migrationsTableName: 'migrations',
});
