-- psql -d messages -f init_tables.sql

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  roomId INTEGER,
  sender TEXT,
  message TEXT,
  FOREIGN KEY (roomId) REFERENCES rooms(id)
);