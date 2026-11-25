CREATE TABLE IF NOT EXISTS submission_review_mail (
  submission_id TEXT PRIMARY KEY REFERENCES indie_submissions(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
  product_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  attempted_at INTEGER,
  resend_id TEXT
);

CREATE TRIGGER IF NOT EXISTS queue_submission_review_mail
AFTER UPDATE OF status ON indie_submissions
WHEN OLD.status <> NEW.status
BEGIN
  DELETE FROM submission_review_mail WHERE submission_id = NEW.id;
  INSERT INTO submission_review_mail (submission_id, event_id, status, product_name, recipient)
  SELECT NEW.id, lower(hex(randomblob(16))), NEW.status, NEW.name, NEW.email
  WHERE NEW.status IN ('approved', 'rejected');
END;
