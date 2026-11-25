ALTER TABLE indie_submissions ADD COLUMN reviewMessage TEXT NOT NULL DEFAULT '';
ALTER TABLE submission_review_mail ADD COLUMN decision_detail TEXT NOT NULL DEFAULT '';

DROP TRIGGER queue_submission_review_mail;

CREATE TRIGGER queue_submission_review_mail
AFTER UPDATE OF status ON indie_submissions
WHEN OLD.status <> NEW.status
BEGIN
  DELETE FROM submission_review_mail WHERE submission_id = NEW.id;
  INSERT INTO submission_review_mail (submission_id, event_id, status, product_name, recipient, decision_detail)
  SELECT NEW.id, lower(hex(randomblob(16))), NEW.status, NEW.name, NEW.email, NEW.reviewMessage
  WHERE NEW.status IN ('approved', 'rejected');
END;
