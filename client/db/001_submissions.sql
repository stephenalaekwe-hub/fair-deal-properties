-- ════════════════════════════════════════════════════════════════════════════
-- FAIR DEAL PROPERTIES LTD
-- Migration 001 - submissions table
--
-- Target: AWS RDS for PostgreSQL 16 or later
-- Run as the schema owner, NOT as the application role.
--
-- Legal basis for the design of this table:
--   NDPA 2023 s.24(1)(c)  data minimisation - only the columns the purpose needs
--   NDPA 2023 s.24(1)(d)  storage limitation - erase_after on every row
--   NDPA 2023 s.24(2)     technical and organisational measures
--   NDPA 2023 s.24(3)     accountability - the retention decision is evidenced on the row
--   GAID 2025 Art 49(3)   six calendar months by default
--   GAID 2025 Art 49(4)   longer only to defend a legal claim or for due diligence
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE submission_collection AS ENUM (
  'contact', 'enquiry', 'alert', 'newsletter', 'inspection', 'dsr', 'snag'
);

CREATE TYPE retention_trigger AS ENUM (
  'purpose-accomplished', 'consent-withdrawn', 'record-created'
);

CREATE TABLE submissions (
  id                    uuid PRIMARY KEY,
  reference             text NOT NULL UNIQUE,
  collection            submission_collection NOT NULL,

  received_at           timestamptz NOT NULL,

  -- A deadline the FIRM published and must honour. No instrument fixes a period for
  -- a data subject request (NDPA 2023 s.34 says "without undue delay") or for a SNAG
  -- (GAID 2025 Art 40). This column is therefore a service commitment, not a
  -- statutory deadline, and must not be described as one.
  due_at                timestamptz,

  payload               jsonb NOT NULL,

  -- The caller's address is personal data. Only a salted one-way hash is retained,
  -- which supports abuse investigation without holding the address itself.
  ip_hash               text,
  user_agent            text,

  -- ── retention, evidenced on the row ──
  retention_months      integer NOT NULL,
  retention_trigger     retention_trigger NOT NULL,
  retention_basis       text NOT NULL,
  -- When the triggering event actually occurred. NULL until the matter closes or
  -- consent is withdrawn, for collections whose clock does not start at creation.
  retention_trigger_at  timestamptz,
  erase_after           timestamptz NOT NULL,

  -- ── lifecycle ──
  closed_at             timestamptz,
  closed_by             text,
  outcome               text,
  erased_at             timestamptz,

  created_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN submissions.due_at IS
  'Firm service commitment. NOT a statutory deadline - no instrument fixes one for a DSR or a SNAG.';
COMMENT ON COLUMN submissions.erase_after IS
  'GAID 2025 Art 49(3) default six months; longer only with the Art 49(4) justification in retention_basis.';
COMMENT ON COLUMN submissions.ip_hash IS
  'Salted SHA-256 prefix. The address itself is never stored.';

-- The DPO works from this index, not from an inbox.
CREATE INDEX submissions_open_requests_idx
  ON submissions (due_at)
  WHERE collection IN ('dsr', 'snag') AND closed_at IS NULL AND erased_at IS NULL;

-- The erasure sweep scans this one.
CREATE INDEX submissions_erase_after_idx
  ON submissions (erase_after)
  WHERE erased_at IS NULL;

CREATE INDEX submissions_collection_received_idx
  ON submissions (collection, received_at DESC);

-- ════════════════════════════════════════════════════════════════════════════
-- Least-privilege application role.
--
-- The application can insert, read and update. It CANNOT DELETE: erasure is an
-- overwrite that leaves the row as proof the erasure happened, and a role that can
-- drop rows can destroy the evidence of its own compliance.
-- ════════════════════════════════════════════════════════════════════════════

-- Replace the password before running. In production the credential is issued and
-- rotated by AWS Secrets Manager, and this statement is not used at all.
-- CREATE ROLE fdp_app LOGIN PASSWORD 'replace-me';

GRANT CONNECT ON DATABASE CURRENT_CATALOG TO fdp_app;
GRANT USAGE ON SCHEMA public TO fdp_app;
GRANT SELECT, INSERT, UPDATE ON submissions TO fdp_app;
REVOKE DELETE, TRUNCATE ON submissions FROM fdp_app;

-- A read-only role for the DPO and for audit. Grant this to a human, never fdp_app.
-- CREATE ROLE fdp_auditor LOGIN PASSWORD 'replace-me';
GRANT CONNECT ON DATABASE CURRENT_CATALOG TO fdp_auditor;
GRANT USAGE ON SCHEMA public TO fdp_auditor;
GRANT SELECT ON submissions TO fdp_auditor;

COMMIT;
