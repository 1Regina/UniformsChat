CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  phone VARCHAR(8),
  is_donor BOOLEAN,
  is_recipient BOOLEAN,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  photo TEXT
);

CREATE TABLE IF NOT EXISTS schools (
  school_id SERIAL PRIMARY KEY,
  school_name TEXT,
  school_code TEXT
);

CREATE TABLE IF NOT EXISTS uniforms (
  id SERIAL PRIMARY KEY,
  type TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER REFERENCES users(id),
  school_id INTEGER REFERENCES schools(school_id),
  uniform_id INTEGER REFERENCES uniforms(id),
  size VARCHAR(10),
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS donation_Request (
  id SERIAL PRIMARY KEY,
  recipient_id INTEGER REFERENCES users(id),
  inventory_id INTEGER REFERENCES inventory(id),
  reserved_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTs chats (
  id SERIAL PRIMARY KEY,
  comment TEXT,
  item_id INTEGER REFERENCES donation_Request(id),
  chat_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
)




