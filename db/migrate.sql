CREATE TABLE IF NOT EXISTS documents (
    title TEXT,
    content TEXT,
    created_at DATE DEFAULT (datetime('now','localtime'))
);
