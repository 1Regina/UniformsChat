-- psql -d messages -f init_tables.sql

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- CREATE TABLE IF NOT EXISTS messages (
--   id SERIAL PRIMARY KEY,
--   roomId INTEGER,
--   sender TEXT,
--   message TEXT,
--   FOREIGN KEY (roomId) REFERENCES rooms(id),
--   send_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

CREATE TABLE IF NOT EXISTS conversation (
  id SERIAL PRIMARY KEY,
  reservation_id INTEGER,
  room_id INTEGER REFERENCES rooms(id),
  sender_id TEXT REFERENCES users (id),
  recipient_id TEXT REFERENCES users (id),
  message TEXT NOT NULL,
  -- FOREIGN KEY (room_id) REFERENCES rooms(id),
  send_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 
);