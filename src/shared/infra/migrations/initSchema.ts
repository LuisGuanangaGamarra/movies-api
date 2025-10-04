import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const bcryptRounds = 12;
const userAdmin = process.env.USER_ADMIN;
const passwordAdmin = process.env.PASSWORD_ADMIN;

export class InitSchema1700000001000 implements MigrationInterface {
  name = 'InitSchema1700000001000';

  public async up(qr: QueryRunner): Promise<void> {
    await qr.query(`
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    await qr.query(`
      CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    await qr.query(`
      CREATE TABLE role_permissions (
        role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );
    `);

    await qr.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await qr.query(`
      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        director VARCHAR(120),
        release_date DATE,
        synopsis TEXT,
        external_id VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT NULL
      );
    `);

    await qr.query(`INSERT INTO roles (name) VALUES ('ADMIN'), ('REGULAR');`);

    await qr.query(`
      INSERT INTO permissions (name) VALUES
      ('MOVIE_READ'),
      ('MOVIE_CREATE'),
      ('MOVIE_UPDATE'),
      ('MOVIE_DELETE'),
      ('MOVIE_SYNC'),
      ('USER_CREATE_ADMIN');
    `);

    await qr.query(`INSERT INTO role_permissions (role_id, permission_id)
      SELECT 1, id FROM permissions;`);

    await qr.query(`INSERT INTO role_permissions (role_id, permission_id)
      SELECT 2, id FROM permissions WHERE name IN ('MOVIE_READ');`);

    const hash = await bcrypt.hash(passwordAdmin!, bcryptRounds);
    await qr.query(`
      INSERT INTO users (email, password_hash, role_id)
      VALUES ('${userAdmin}', '${hash}', 1);
    `);
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP TABLE IF EXISTS movies;`);
    await qr.query(`DROP TABLE IF EXISTS users;`);
    await qr.query(`DROP TABLE IF EXISTS role_permissions;`);
    await qr.query(`DROP TABLE IF EXISTS permissions;`);
    await qr.query(`DROP TABLE IF EXISTS roles;`);
  }
}
