# 📧 Email Setup Guide — Fair Deal Properties Ltd
### Domain: `fdealproperties.com`
**Date: October 2026**
**Ref: FDP-IT-EMAIL-01**

---

## Why This Is Needed

The Fair Deal Properties website application (`fdealproperties.com`) sends automatic email
notifications to the firm whenever:

- A client submits a **contact or enquiry form**
- A client requests a **property inspection**
- A client subscribes to **listing alerts or the newsletter**
- A **Data Subject Request (DSR)** is received under the Nigeria Data Protection Act 2023
- A **snag/grievance notice** is filed

For any of these to reach the firm's inbox, a working email address on the domain
`fdealproperties.com` must be set up and connected to the website.

The email addresses that need to exist are:

| Address | Purpose |
|---------|---------|
| `info@fdealproperties.com` | General enquiries, contact forms, newsletters |
| `inspections@fdealproperties.com` | Inspection request notifications |
| `dpo@fdealproperties.com` | Data Subject Requests (legally required under NDPA 2023) |
| `no-reply@fdealproperties.com` | Outbound sender address (website sends *from* this) |

---

## Option A — Whogohost (Your Domain Registrar) ⭐ Recommended First Check

### What to Check
Since `fdealproperties.com` is registered with **Whogohost**, the firm may already have
free email hosting included — depending on whether a hosting plan was purchased alongside
the domain.

### Steps for the Company to Follow

1. Go to [https://www.whogohost.com](https://www.whogohost.com) and log in to the account
   used to buy the domain.

2. From the dashboard, look for **"cPanel"** or **"Manage Hosting"** next to
   `fdealproperties.com`.

   - **If cPanel is available** → the hosting plan includes email. Proceed to step 3.
   - **If only "Manage Domain" is available** → only the domain was purchased, no hosting.
     Skip to Option B or Option C below.

3. Inside cPanel, click **"Email Accounts"**.

4. Create the following accounts:
   - `info@fdealproperties.com`
   - `inspections@fdealproperties.com`
   - `dpo@fdealproperties.com`
   - `no-reply@fdealproperties.com`

5. After creating the accounts, find the **SMTP settings** (usually shown as):
   - **SMTP Host**: `mail.fdealproperties.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: the full email address
   - **Password**: the password set during account creation

6. Share these SMTP credentials securely with the developer so
   they can connect the website to the email account.

### Cost
**Free** — included in most Whogohost hosting plans.

---

## Option B — Google Workspace (Gmail for Business)

### What It Is
Google Workspace gives the firm professional Gmail inboxes using their own domain —
e.g. `info@fdealproperties.com` — with the full Gmail interface.

### Steps

1. Go to [https://workspace.google.com](https://workspace.google.com) and click
   **"Get Started"**.

2. Enter the business name and select **"I have a domain"** → type `fdealproperties.com`.

3. Create the admin account (e.g. `info@fdealproperties.com`).

4. Google will ask you to **verify domain ownership**. This is done by:
   - Logging in to Whogohost
   - Going to **DNS Management** for `fdealproperties.com`
   - Adding a TXT record that Google provides (copy-paste, takes 5–10 minutes to activate)

5. After verification, Google will provide **MX records**. These also need to be added to
   Whogohost DNS (the developer or a tech-savvy person can do this — it takes about
   10 minutes).

6. Once DNS propagates (up to 24 hours), all `@fdealproperties.com` emails will flow
   through Gmail.

7. Share API credentials or an App Password with the developer to connect the
   website.

### Cost
- **Business Starter**: $6 USD/user/month (~₦9,000/month at current rates)
- **14-day free trial** available

### Pros
- Familiar Gmail interface
- Excellent spam filtering
- Works on mobile, desktop, everywhere
- Very reliable

### Cons
- Monthly cost
- Requires DNS changes on Whogohost

---

## Option C — Resend (Best for Automated Website Emails Only)

### What It Is
[Resend](https://resend.com) is a developer email service designed specifically for
websites sending automated notifications. It does **not** provide a personal inbox —
it only sends emails *from* the website to whichever inbox the firm already has.

This is ideal if the firm already has a working email (e.g. a Gmail, Yahoo, or any other
inbox) and just needs the website to be able to send notifications to it.

### Steps

1. The developer creates a free account at
   [https://resend.com](https://resend.com).

2. Inside Resend, the domain `fdealproperties.com` is added and verified by:
   - Adding 3 DNS records to Whogohost (the developer handles this — takes ~10 minutes)

3. Once verified, the developer generates an **API Key** from the Resend dashboard and
   plugs it into the website.

4. The website can now send from `no-reply@fdealproperties.com` to any inbox the firm
   specifies (e.g. the firm's existing personal or business Gmail).

5. The firm shares with the developer what inbox they want notifications delivered to.

### Cost
- **Free tier**: 3,000 emails per month — more than sufficient for a property firm
- **Paid plans** start at $20/month if volume ever exceeds that

### Pros
- Free for the volume a property firm will realistically send
- No DNS complexity beyond 3 simple records
- Very quick to set up (1 hour)
- No monthly subscription

### Cons
- **Does not provide an inbox** — the firm cannot use it to send emails themselves
- Only handles automated website-to-firm notifications

---

## Option D — AWS Simple Email Service (SES)

### What It Is
Amazon Web Services offers a highly reliable email sending service. Like Resend, it
handles outbound automated emails — not a personal inbox.

### Cost
- **62,000 emails free per month** if the website is hosted on AWS infrastructure
- **$0.10 per 1,000 emails** otherwise (effectively free at any realistic volume)

### Steps
This option requires more technical setup and is best handled entirely by the developer.
The firm only needs to:
1. Create a free AWS account at [https://aws.amazon.com](https://aws.amazon.com) and
   share access credentials with the developer, **OR**
2. Ask the developer to set it up under the developer's AWS account (which is equally valid).

### Pros
- Extremely reliable (used by major corporations worldwide)
- Very cheap / effectively free
- Scales infinitely

### Cons
- Most technical option — the firm should leave this entirely to the developer
- Requires AWS account setup

---

## Option E — Zoho Mail (Free Business Email)

### What It Is
Zoho Mail offers **free professional email hosting** for up to 5 users on a custom domain.
Unlike Resend or AWS SES, this gives the firm an actual inbox they can log into and use
daily.

### Steps

1. Go to [https://www.zoho.com/mail/](https://www.zoho.com/mail/) and click
   **"Sign Up For Free"**.

2. Select **"Zoho Mail Lite — Free Plan"**.

3. Enter `fdealproperties.com` as the domain.

4. Zoho will ask to verify the domain — this requires adding a TXT record on Whogohost
   (the developer or any tech-savvy person can do this in about 10 minutes).

5. Once verified, add MX records to Whogohost DNS (Zoho provides the exact values).

6. Create the email accounts:
   - `info@fdealproperties.com`
   - `dpo@fdealproperties.com`
   - `inspections@fdealproperties.com`

7. Share the SMTP credentials with the developer to connect the website.

### Cost
**Free** for up to 5 users, 5 GB per mailbox.

### Pros
- Completely free
- Real inbox with web interface (similar to Gmail)
- Works on mobile via Zoho Mail app
- Supports SMTP for website integration

### Cons
- Not as polished as Gmail
- Requires DNS changes

---

## Summary Comparison

| Option | Cost | Provides Inbox? | Technical Difficulty | Best For |
|--------|------|----------------|---------------------|----------|
| **A — Whogohost cPanel** | Free (if hosting plan exists) | ✅ Yes | Low | Check this first |
| **B — Google Workspace** | $6/user/month | ✅ Yes (Gmail) | Medium | Best long-term |
| **C — Resend** | Free (3k/month) | ❌ No (sends only) | Low (developer handles) | Website notifications only |
| **D — AWS SES** | Free / ~free | ❌ No (sends only) | High (developer handles) | AWS-hosted setups |
| **E — Zoho Mail** | Free (5 users) | ✅ Yes | Medium | Free Gmail alternative |

---

## Recommended Path

**Step 1 (Today — 5 minutes):**
Log in to Whogohost and check whether a hosting plan (cPanel) exists for
`fdealproperties.com`. If yes, Option A is free and immediate.

**Step 2 (If no cPanel):**
Sign up for **Zoho Mail** (Option E) — free, provides real inboxes, and the developer
can connect the website to it within a day.

**Step 3 (If the firm prefers Gmail):**
Purchase **Google Workspace** (Option B) — $6/month per user, best long-term experience.

**For the website's automated sending** (regardless of which inbox option is chosen):
The developer will implement **Option C (Resend)** as the outbound sending engine, which
is free and takes approximately one hour to configure once the domain DNS records are in
place.

---

## Information the Developer Needs From the Company

Once an option is chosen, please provide the following for technical setup:

- [ ] Chosen email provider (A, B, C, D, or E)
- [ ] Login access to Whogohost (for DNS record changes) — **or** permission to make DNS
      changes on the firm's behalf
- [ ] SMTP credentials (if Option A or E is chosen) — sent securely, not by WhatsApp
      or open email
- [ ] Preferred inbox address for enquiries (e.g. `info@fdealproperties.com`)
- [ ] Preferred inbox address for DSR/data protection matters (e.g. `dpo@fdealproperties.com`)

---

*Fair Deal Properties Ltd Website Project · October 2026 · Ref: FDP-IT-EMAIL-01*
