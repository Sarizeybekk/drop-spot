CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    account_created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS drops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    total_stock INTEGER NOT NULL DEFAULT 0,
    claim_window_start INTEGER NOT NULL,
    claim_window_end INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS waitlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    joined_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    signup_latency_ms INTEGER DEFAULT 0,
    priority_score REAL DEFAULT 0,
    UNIQUE(drop_id, user_id),
    FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drop_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    claim_code TEXT UNIQUE NOT NULL,
    claimed_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    UNIQUE(drop_id, user_id),
    FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_waitlists_drop_id ON waitlists(drop_id);
CREATE INDEX IF NOT EXISTS idx_waitlists_user_id ON waitlists(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlists_priority ON waitlists(drop_id, priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_claims_drop_id ON claims(drop_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_drops_claim_window ON drops(claim_window_start, claim_window_end);

