-- Up

CREATE TABLE users (
  id INTEGER PRIMARY KEY NOT NULL,
  username VARCHAR(50),
  email VARCHAR(128),
  password VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER [UpdateUsersLastTime]
    AFTER UPDATE ON users FOR EACH ROW WHEN NEW.updated_at < OLD.updated_at
BEGIN
    UPDATE users SET updated_at=CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE access_tokens (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  token VARCHAR(256),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TRIGGER [UpdateAccessTokensLastTime]
    AFTER UPDATE ON access_tokens FOR EACH ROW WHEN NEW.updated_at < OLD.updated_at
BEGIN
    UPDATE access_tokens SET updated_at=CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  token VARCHAR(512),
  access_token_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (access_token_id) REFERENCES access_tokens (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TRIGGER [UpdateRefreshTokensLastTime]
    AFTER UPDATE ON refresh_tokens FOR EACH ROW WHEN NEW.updated_at < OLD.updated_at
BEGIN
    UPDATE refresh_tokens SET updated_at=CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Down

DROP TRIGGER UpdateUsersLastTime;
DROP TRIGGER UpdateAccessTokensLastTime;
DROP TRIGGER UpdateRefreshTokensLastTime;
DROP TABLE refresh_tokens;
DROP TABLE access_tokens;
DROP TABLE users;
