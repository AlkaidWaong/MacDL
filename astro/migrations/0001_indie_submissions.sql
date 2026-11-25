CREATE TABLE IF NOT EXISTS indie_submissions (
  id TEXT PRIMARY KEY,
  challenge_digest TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  downloadUrl TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  pricing TEXT NOT NULL,
  systemRequirements TEXT NOT NULL,
  mediaUrl TEXT NOT NULL,
  email TEXT NOT NULL,
  reviewAccessNotes TEXT NOT NULL,
  reviewNotes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS indie_submissions_queue ON indie_submissions(status, created_at, id);
