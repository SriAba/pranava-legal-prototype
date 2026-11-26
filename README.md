# Pranava Legal Solutions — Clickable Prototype

A working HTML/CSS/JavaScript prototype of the case-management tool for Pranava Legal Solutions.
No server, build step or install is needed.

## How to open

**Option A (simplest):** double-click `index.html` to open it in Chrome or Edge.

**Option B (recommended in VS Code):**
1. Open this folder in VS Code (`File → Open Folder…`).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.

## Demo logins

| Role      | Username    | Password    | Name               |
|-----------|-------------|-------------|--------------------|
| Admin     | `admin`     | `admin123`  | Ananya Rao         |
| Paralegal | `paralegal` | `para123`   | Kavya Menon        |
| Lawyer    | `lawyer`    | `law123`    | Adv. Raghav Iyer   |
| Lawyer    | `shalini`   | `law123`    | Adv. Shalini Gowda |
| Client    | `client`    | `client123` | Suresh Kumar       |
| Client    | `meera`     | `client123` | Meera Nair         |
| Client    | `imran`     | `client123` | Imran Sheikh       |
| Client    | `lakshmi`   | `client123` | Lakshmi Devi       |

The login screen also has one-click buttons for the four main roles. Sign out from the profile card in the top-right corner.

## Screens

| File | Screen | Who |
|------|--------|-----|
| `index.html` | Login | All |
| `cases.html` | Cases list: Pending / In Progress / Closed tabs, search, filters, Add case | All (clients see only their own files and the columns they need) |
| `case-new.html` | New case: existing/new client, case type (advance auto-filled), **Payment made** checkbox, notification preview | Admin, Paralegal, Lawyer |
| `documents-add.html` | Add documents: file type, from/to dates when configured, soft-copy upload, link to the lawyer's requirement, send for review | Admin, Paralegal |
| `case.html?id=…` | Case overview (changes by role, see below) | All |
| `verification.html` | Original verification: choose a case → documents in sequence → mark verified → next one loads automatically | Admin, Paralegal, Lawyer |
| `payment.html` | Payments list and checkout (advance and final) | Client |
| `notifications.html` | Notifications; admin also sees an email/SMS outbox for all users | All |
| `profile.html` | Edit profile, change password | All |
| `admin-case-types.html` | Case types: advance yes/no + amount, original verification yes/no, default final fee | Admin |
| `admin-file-types.html` | File types: has from/to date yes/no | Admin |
| `admin-users.html` | Users list, add user | Admin |

### Case overview by role
- **Paralegal:** timeline of documents and events, open requirements from the lawyer, mark advance as paid, add documents, verify originals inline.
- **Lawyer:** same timeline plus the **Lawyer workspace** on the right with notes (optionally visible to the client), further documents required, remarks on specific documents, and a status dropdown with remarks, file upload and Submit (sends email/SMS/in-app updates). Also a "documents at a glance" grid.
- **Client:** their documents, remarks, original verification status, lawyer updates and shared notes, and an upload button for each requested document. Opening a file with an unpaid advance goes to payment. Once a file is **Resolved**, the client is sent to the final payment and the report unlocks after paying.

## Try this end-to-end flow
1. **Paralegal** → Add case → choose a client and case type → tick *Payment made* → Create.
2. Add two documents → keep *Send to lawyer for review* ticked → Done.
3. **Lawyer** → open the case → add a requirement → set status *Documents Required* → Submit.
4. **Client** (if you used a demo client) → the case shows *Documents requested* → Upload.
5. **Lawyer** → status *Original Verification* → **Paralegal** → Original Verification screen → verify each document.
6. **Lawyer** → status *Resolved*, attach a report → **Client** → pay → final report unlocks.

## How it works
- `assets/js/data.js` holds the sample data. On first load it is copied into the browser's `localStorage`, so anything you add carries over between screens and visits.
- **Reset demo data** (bottom of the sidebar) restores the original sample data.
- Email and SMS are **simulated**: they appear as toasts, in the recipient's bell icon and in the admin outbox.
- Uploaded images and PDFs under 1 MB are stored and can be viewed. Larger files keep only their name. Sample documents show a placeholder page.

## Folder structure
```
index.html, cases.html, case.html, …     one HTML file per screen
assets/css/styles.css                     all styling (colour tokens at the top)
assets/js/app.js                          shared shell, storage, notifications, helpers
assets/js/case.js                         case overview logic (all roles)
assets/js/data.js                         sample data
assets/img/logo.svg                       full logo, for light backgrounds
assets/img/logo-light.svg                 full logo, for dark backgrounds
assets/img/logo-mark.svg / .png           emblem only (app icon, favicon, stamps)
assets/img/logo.png                       full logo as PNG
```

## Logo
An arched shield (strength, but with rounded, open-doorway lines) containing three pillars (the institution of law), golden foundation steps (a solid footing) and a rising sun (clarity and hope). Colours: navy `#0B2349`, royal blue `#1F4E9E`, gold `#F2A900` / `#FFC72C`. The wordmark uses Cinzel for *PRANAVA* and Inter for *LEGAL SOLUTIONS*.

## Assumptions made for the prototype
- **Case statuses:** Awaiting Documents, Documents Required (*Pending*); Under Review, Original Verification (*In Progress*); Resolved (*Closed*).
- **Final fee:** each case type has a default final fee, and the lawyer can adjust it when resolving.
- **Notes:** lawyer notes are internal by default. A "Visible to client" checkbox shares a note.
- **Client uploads:** when a client uploads every requested document, the case goes back to *Under Review* automatically.
- **GST:** the 18% GST on the payment screen is illustrative only.
