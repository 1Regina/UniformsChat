import pg from 'pg';

const { Pool } = pg;

const pgConnectionConfigs = {
  user: 'regina',
  host: 'localhost',
  database: 'uniforms',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

export default pool;
