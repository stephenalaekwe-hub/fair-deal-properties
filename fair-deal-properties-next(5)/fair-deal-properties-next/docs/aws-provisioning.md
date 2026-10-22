# AWS Provisioning - Fair Deal Properties Ltd

**Version 1.0 | 14 October 2026**
Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co

---

## Position Statement

The application driver in `src/lib/drivers/postgres.ts` discharges the application half
of NDPA 2023 s.24(2). The infrastructure half is discharged here, or not at all. A
correctly written driver pointed at a publicly reachable, unencrypted RDS instance is
not compliant - it is compliant-looking, which is worse, because it reads as deliberate.

Separately and more seriously: **AWS operates no region in Nigeria.** Every deployment
of this stack transfers personal data out of Nigeria and engages Part VIII of the NDPA
2023. That is not a configuration item. It is a transfer that must be lawful before the
first row is written, and recorded under s.41(2) whether or not anyone asks to see it.

---

## 1. The cross-border position - settle this before provisioning

| Requirement | Instrument | What it means here |
|---|---|---|
| No transfer out of Nigeria unless adequacy is established, or an s.43 condition applies | NDPA 2023 s.41(1) | Picking a region is a legal decision, not a latency decision |
| The legal basis and the adequacy assessment must be **recorded** | NDPA 2023 s.41(2) | FDP-DP-30 in the compliance pack is that record |
| Adequacy evaluated against Schedule 5 until the Commission issues a cross-border instrument | GAID 2025 Art 45 | There is no published whitelist to rely on yet |
| A DPIA is **mandatory** for cross-border transfer | GAID 2025 Art 28(3)(o) | FDP-DP-31 in the compliance pack |
| Consent required for transfer to a country with no adequacy decision | GAID 2025 Art 18(1)(e) | Consent as the basis for your own hosting is a weak position - see below |
| The DPA must state the processing location, taking the cross-border rules into account | GAID 2025 Art 34(2)(f) | The AWS DPA must name the region |

**Why consent alone would be the wrong basis here.** Article 18(1)(e) permits transfer on consent
where no adequacy decision covers the destination. Relying on it for your own hosting
means every data subject can withdraw the basis on which their record is stored, and a
withdrawal would oblige you to repatriate or erase that record. It also means a visitor
who declines cannot use the site at all, which makes the consent questionably free.
The law limb and the contractual clauses limb of s.41(1)(a) are the route, with consent
added on the forms to close the Article 18(1)(e) gap rather than to carry the transfer.

> **VERIFY - worth doing, but it no longer blocks provisioning.** Whether the
> Commission has issued an adequacy decision covering Ireland, and whether Schedule 5 to
> GAID 2025 names any country. Schedule 5 was not retrievable in full at the date of
> this document. If a decision exists it strengthens the file; the transfer is lawful
> under s.41(1)(a) either way, which is why it is not relied on.
> **[PRINCIPAL SIGN-OFF REQUIRED]**

### Region selection - settled

**Region: `eu-west-1` (Ireland).** Confirmed by the Principal, 14 October 2026.

**The basis recorded is section 41(1)(a), law limb - not an adequacy decision.**

| Limb | Basis | Status |
|---|---|---|
| Primary | NDPA 2023 s.41(1)(a) - the recipient is bound by **a law** which provides an adequate level of protection. That law is Regulation (EU) 2016/679 (GDPR), in force in Ireland | Relied on |
| Alternative | NDPA 2023 s.41(1)(a) - **contractual clauses**. The AWS Data Processing Addendum and its standard contractual clauses | Relied on, independently |
| Not relied on | A Commission adequacy decision under s.42 | **Not asserted** |

**Why the third row matters.** The GDPR being in force in Ireland is not an adequacy
decision. Adequacy under s.42 is a determination the Nigeria Data Protection Commission
makes, about that country, for Nigerian data subjects, and an EU adequacy decision runs
EU to third country - it says nothing about Nigeria to EU. Recording "there is an
adequacy decision" when the Commission has issued none would put a false statement into
the firm's own compliance file. The law limb and the contractual clauses limb are each
sufficient without one, and two independent limbs is a stronger position than one
asserted decision.

**The Article 18(1)(e) tension, and how it is closed.** GAID 2025 Article 18(1)(e)
requires consent before transfer to a country with no Commission adequacy decision.
Read strictly it bites even where s.41(1)(a) is satisfied, because the Directive keys to
a decision while the Act keys to adequate protection. The Act prevails on a conflict,
but the firm should not have to argue that in an inspection when closing it costs one
clause. Every consent checkbox on the site now discloses the transfer and the
destination, which satisfies Article 18(1)(e) on its face.

**Obligations unchanged by the region choice:**

- **DPIA is mandatory.** GAID Article 28(3)(o) keys to cross-border transfer, not to
  adequacy. See FDP-DP-31.
- **The transfer must be recorded.** NDPA 2023 s.41(2) requires the legal basis and the
  adequacy assessment to be recorded. See FDP-DP-30.
- **The Privacy Notice must disclose it.** NDPA 2023 s.27. Done - see the cross-border
  transfer article in the notice.

---

## 2. RDS instance

| Setting | Value | Why |
|---|---|---|
| Engine | PostgreSQL 16 or later | — |
| Class | `db.t4g.micro` to start | 30 submissions a day does not need more |
| Storage encryption | **Enabled**, customer-managed KMS key | NDPA 2023 s.24(2). The AWS-managed key is acceptable; a customer-managed key gives you the ability to revoke |
| Public accessibility | **No** | The instance must not be reachable from the internet |
| VPC | Private subnets only, in a dedicated security group | — |
| Inbound rule | Port 5432 from the application security group only | Not from `0.0.0.0/0`, and not from your office IP "temporarily" |
| `rds.force_ssl` | **1**, set in the parameter group | Without it, a misconfigured client can connect in plaintext and nothing will warn you |
| Automated backups | 7 days minimum | — |
| Backup encryption | Inherits the KMS key | A backup is a copy of the personal data and carries the same obligations |
| Deletion protection | Enabled | — |
| Performance Insights | Enabled, 7-day retention | — |
| Enhanced monitoring | Enabled | — |

**Do not enable the RDS Data API or any public endpoint.** The application reaches the
database from inside the VPC.

---

## 3. Credentials

Never in a committed file, never in the Amplify or Vercel UI as plain text.

1. Create the secret in **AWS Secrets Manager**, not Parameter Store, because Secrets
   Manager rotates.
2. Enable automatic rotation, 30 days.
3. Grant the application role `secretsmanager:GetSecretValue` on that secret alone.
4. The application reads `DATABASE_URL` from the injected secret at start.

The migration creates two roles. Use both:

| Role | Grants | Who holds it |
|---|---|---|
| `fdp_app` | SELECT, INSERT, UPDATE. **No DELETE** | The application only |
| `fdp_auditor` | SELECT | The Data Protection Officer, and the external auditor during an engagement |

`fdp_app` cannot delete because erasure is an overwrite that leaves the row as proof the
erasure happened. A role that can drop rows can destroy the evidence of its own
compliance, and an auditor will ask.

---

## 4. TLS certificate

The driver sets `rejectUnauthorized: true` and offers no option to disable it. Supply
the AWS RDS regional certificate bundle:

```bash
# eu-west-1 (Ireland)
curl -o rds-ca.pem https://truststore.pki.rds.amazonaws.com/eu-west-1/eu-west-1-bundle.pem
```

Then set `FDP_DB_CA` to the file contents, or set `PGSSLROOTCERT` to its path.

If you find yourself tempted to set `rejectUnauthorized: false` to make a connection
work, the connection is telling you something true about itself. Fix the certificate.

---

## 5. Running the migration

```bash
psql "$DATABASE_URL" -f db/001_submissions.sql
```

Run it as the schema owner, not as `fdp_app`. Uncomment and set the two `CREATE ROLE`
statements first, or create the roles through Secrets Manager and leave them commented.

---

## 6. The retention sweep - schedule it or the schedule is fiction

`POST /api/internal/retention-sweep` executes the erasure schedule in
`src/lib/retention.ts`. It is protected by `FDP_INTERNAL_SECRET` and must run daily.

**EventBridge Scheduler**, daily at 02:00 WAT:

```
Target:  HTTPS endpoint  https://www.fairdealng.com/api/internal/retention-sweep
Method:  POST
Header:  x-fdp-internal-secret: <value of FDP_INTERNAL_SECRET>
```

**Vercel cron**, if deployed there - add to `vercel.json`:

```json
{ "crons": [{ "path": "/api/internal/retention-sweep", "schedule": "0 1 * * *" }] }
```

Keep the run output. It is the evidence that the retention schedule was executed, and
it is the first thing to produce when an inspector asks whether s.24(1)(d) is
discharged in practice rather than on paper.

### One operational step the code cannot do for you

For `contact`, `enquiry`, `alert` and `newsletter`, the retention clock starts when the
purpose is accomplished or consent is withdrawn - **not** when the record was created.
The driver writes a provisional ceiling at insert time. When the matter actually closes,
call `startRetentionClock(reference)` so the real date is written.

If nobody does this, the six-month period runs from receipt instead of from closure.
That errs on the side of earlier erasure, so it is not a contravention - but it will
destroy enquiry records that are still live, and the firm will blame the software.

---

## 7. Environment variables

```bash
FDP_STORE=postgres
DATABASE_URL=                    # from Secrets Manager, never committed
FDP_DB_CA=                       # RDS regional certificate bundle contents
FDP_DB_POOL_MAX=5
FDP_IP_SALT=                     # high-entropy, unique to this deployment
FDP_INTERNAL_SECRET=             # high-entropy, for the retention sweep

NEXT_PUBLIC_SITE_URL=https://www.fairdealng.com
FDP_DPO_INBOX=
FDP_ENQUIRY_INBOX=
FDP_INSPECTION_INBOX=
FDP_MAIL_PROVIDER=
FDP_MAIL_API_KEY=
FDP_MAIL_FROM=
```

`FDP_IP_SALT` has a default in the code so that development works. **Change it.** A
known salt makes the IP hashes reversible by anyone who reads the source, which turns a
pseudonymisation measure into a stored IP address.

---

## 8. What is still not done after this document

| Item | Owner | Instrument |
|---|---|---|
| Cross-border transfer assessment, signed and filed | Principal | NDPA 2023 s.41(2) |
| DPIA for the website and cloud hosting | DPO | GAID 2025 Art 28(3)(o) |
| AWS Data Processing Addendum executed and filed | Principal | GAID 2025 Art 34(1) |
| Processor assessment for AWS, and for the email provider | DPO | GAID 2025 Art 34(3) |
| Record of Processing Activities updated to name AWS and eu-west-1 | DPO | — |
| ~~Privacy Notice updated to disclose the transfer and the region~~ **done** | — | NDPA 2023 s.27 |

The last row is done - the Privacy Notice now carries a cross-border transfer article
naming AWS, Ireland, the s.41(1)(a) basis and the fact that no adequacy decision is
asserted. Keep it accurate if the region ever changes.

---

**Prepared for Fair Deal Properties Ltd by Stephen Alaekwe & Co**
Version 1.0 · 14 October 2026 · [PRINCIPAL SIGN-OFF REQUIRED]
