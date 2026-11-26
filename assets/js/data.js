/* =========================================================
   Pranava Legal Solutions — Seed / mock data
   Everything here is sample data for the prototype.
   It is copied into browser localStorage on first load;
   use "Reset demo data" in the sidebar to restore it.
   ========================================================= */
window.PLS_SEED = {
  version: 3,

  settings: {
    firmName: "Pranava Legal Solutions",
    filePrefix: "PLS",
    currency: "₹"
  },

  users: [
    { id: "u1", role: "admin",     name: "Ananya Rao",        username: "admin",     password: "admin123",  email: "ananya.rao@pranavalegal.in",   phone: "+91 98450 11001", title: "Office Administrator" },
    { id: "u2", role: "paralegal", name: "Kavya Menon",       username: "paralegal", password: "para123",   email: "kavya.menon@pranavalegal.in",  phone: "+91 98450 11002", title: "Senior Paralegal" },
    { id: "u3", role: "lawyer",    name: "Adv. Raghav Iyer",  username: "lawyer",    password: "law123",    email: "raghav.iyer@pranavalegal.in",  phone: "+91 98450 11003", title: "Partner, Property & Civil" },
    { id: "u4", role: "lawyer",    name: "Adv. Shalini Gowda",username: "shalini",   password: "law123",    email: "shalini.gowda@pranavalegal.in",phone: "+91 98450 11004", title: "Associate, Family Law" },
    { id: "u5", role: "client",    name: "Suresh Kumar",      username: "client",    password: "client123", email: "suresh.kumar@example.com",     phone: "+91 99000 22001", address: "No. 14, 3rd Cross, Jayanagar 4th Block, Bengaluru 560011" },
    { id: "u6", role: "client",    name: "Meera Nair",        username: "meera",     password: "client123", email: "meera.nair@example.com",       phone: "+91 99000 22002", address: "Flat 302, Prestige Lakeside, Whitefield, Bengaluru 560066" },
    { id: "u7", role: "client",    name: "Imran Sheikh",      username: "imran",     password: "client123", email: "imran.sheikh@example.com",     phone: "+91 99000 22003", address: "22, Frazer Town Main Road, Bengaluru 560005" },
    { id: "u8", role: "client",    name: "Lakshmi Devi",      username: "lakshmi",   password: "client123", email: "lakshmi.devi@example.com",     phone: "+91 99000 22004", address: "88, Basavanagudi, Bengaluru 560004" }
  ],

  caseTypes: [
    { id: "ct1", name: "Property Title Verification", advanceRequired: true,  advanceAmount: 5000,  finalFee: 15000, ovRequired: true,  active: true, description: "Due diligence on title documents before purchase." },
    { id: "ct2", name: "Civil Suit",                  advanceRequired: true,  advanceAmount: 25000, finalFee: 50000, ovRequired: true,  active: true, description: "Recovery, injunction and other civil matters." },
    { id: "ct3", name: "Family / Divorce",            advanceRequired: true,  advanceAmount: 15000, finalFee: 35000, ovRequired: false, active: true, description: "Mutual consent and contested divorce, custody." },
    { id: "ct4", name: "Will & Probate",              advanceRequired: true,  advanceAmount: 7500,  finalFee: 20000, ovRequired: true,  active: true, description: "Drafting wills and probate petitions." },
    { id: "ct5", name: "Legal Notice",                advanceRequired: false, advanceAmount: 0,     finalFee: 3500,  ovRequired: false, active: true, description: "Drafting and serving legal notices." },
    { id: "ct6", name: "Rental Agreement Review",     advanceRequired: false, advanceAmount: 0,     finalFee: 2500,  ovRequired: false, active: true, description: "Review of lease / leave-and-licence agreements." }
  ],

  fileTypes: [
    { id: "ft1",  name: "Sale Deed",                 hasDateRange: false, active: true },
    { id: "ft2",  name: "Encumbrance Certificate",   hasDateRange: true,  active: true },
    { id: "ft3",  name: "Khata Certificate",         hasDateRange: false, active: true },
    { id: "ft4",  name: "Property Tax Receipts",     hasDateRange: true,  active: true },
    { id: "ft5",  name: "Aadhaar Card",              hasDateRange: false, active: true },
    { id: "ft6",  name: "PAN Card",                  hasDateRange: false, active: true },
    { id: "ft7",  name: "Marriage Certificate",      hasDateRange: false, active: true },
    { id: "ft8",  name: "Bank Statement",            hasDateRange: true,  active: true },
    { id: "ft9",  name: "Rental Agreement",          hasDateRange: true,  active: true },
    { id: "ft10", name: "Power of Attorney",         hasDateRange: false, active: true },
    { id: "ft11", name: "Death Certificate",         hasDateRange: false, active: true },
    { id: "ft12", name: "Approved Building Plan",    hasDateRange: false, active: true },
    { id: "ft13", name: "Mother Deed / Link Documents", hasDateRange: false, active: true },
    { id: "ft14", name: "Legal Opinion / Report",    hasDateRange: false, active: true },
    { id: "ft15", name: "Other",                     hasDateRange: false, active: true }
  ],

  cases: [
    /* ---------- 1. In progress: Under Review (rich example) ---------- */
    {
      id: "c1", fileNo: "PLS-2026-0141", title: "Title verification — Site No. 47, JP Nagar 7th Phase",
      typeId: "ct1", clientId: "u5", paralegalId: "u2", lawyerId: "u3",
      createdAt: "2026-11-02T10:15:00", status: "Original Verification",
      description: "Client intends to purchase a 30x40 residential site. Requires title chain verification for last 30 years.",
      advance: { amount: 5000, paid: true, mode: "Online (UPI)", paidOn: "2026-11-03T09:40:00", ref: "UPI-8831204417" },
      final: { amount: 15000, paid: false },
      documents: [
        { id: "d1", fileTypeId: "ft1", name: "Sale Deed — 2011 (Ramesh → Prakash)", refNo: "JPN-1-04412/2011", description: "Registered sale deed, 14 pages.", uploadedBy: "u2", uploadedAt: "2026-11-04T11:20:00", fileName: "sale_deed_2011.pdf", ov: { verified: true, by: "u2", at: "2026-11-20T12:05:00" }, remarks: [ { by: "u3", at: "2026-11-06T16:10:00", text: "Schedule matches survey sketch. OK." } ] },
        { id: "d2", fileTypeId: "ft2", name: "Encumbrance Certificate (Form 15)", refNo: "EC/BLR/2026/77812", fromDate: "1996-04-01", toDate: "2026-10-31", description: "30-year EC from Sub-Registrar, Jayanagar.", uploadedBy: "u2", uploadedAt: "2026-11-04T11:32:00", fileName: "ec_form15.pdf", ov: { verified: true, by: "u2", at: "2026-11-20T12:07:00" }, remarks: [ { by: "u3", at: "2026-11-06T16:14:00", text: "Gap between 2003–2004 entries. Need Form 16 for that period." } ] },
        { id: "d3", fileTypeId: "ft3", name: "Khata Certificate & Extract", refNo: "BBMP/KH/119/47", description: "A-Khata in the name of current owner.", uploadedBy: "u2", uploadedAt: "2026-11-04T11:40:00", fileName: "khata.pdf", ov: { verified: false }, remarks: [] },
        { id: "d4", fileTypeId: "ft4", name: "Property Tax Paid Receipts", refNo: "PID 61-44-47", fromDate: "2020-04-01", toDate: "2026-03-31", description: "Six years of tax receipts.", uploadedBy: "u2", uploadedAt: "2026-11-12T15:02:00", fileName: "tax_receipts.pdf", ov: { verified: false }, remarks: [] },
        { id: "d5", fileTypeId: "ft13", name: "Mother Deed (1994 Partition Deed)", refNo: "JPN-1-01120/1994", description: "Submitted after lawyer's request.", uploadedBy: "u5", uploadedAt: "2026-11-12T15:10:00", fileName: "mother_deed_1994.pdf", ov: { verified: false }, remarks: [] }
      ],
      requirements: [
        { id: "r1", text: "Mother deed / link documents prior to 2011", fileTypeId: "ft13", by: "u3", at: "2026-11-06T16:20:00", status: "Submitted" },
        { id: "r2", text: "Property tax receipts for last 6 years", fileTypeId: "ft4", by: "u3", at: "2026-11-06T16:21:00", status: "Submitted" }
      ],
      notes: [
        { id: "n1", by: "u3", at: "2026-11-06T16:25:00", text: "Seller is the 3rd owner. Check whether the 1994 partition included all legal heirs." },
        { id: "n2", by: "u3", at: "2026-11-14T10:05:00", text: "Link documents look consistent. Sending for original verification before final opinion.", shared: true }
      ],
      reviews: [
        { id: "rv1", by: "u3", at: "2026-11-06T16:30:00", status: "Documents Required", remarks: "Please provide the mother deed and 6 years of tax receipts.", attachments: [] },
        { id: "rv2", by: "u3", at: "2026-11-14T10:10:00", status: "Original Verification", remarks: "Please bring all originals to the office for verification.", attachments: [] }
      ],
      timeline: [
        { at: "2026-11-02T10:15:00", by: "u2", kind: "created", text: "Case created and assigned to Adv. Raghav Iyer" },
        { at: "2026-11-03T09:40:00", by: "u5", kind: "payment", text: "Advance of ₹5,000 paid online" },
        { at: "2026-11-04T11:40:00", by: "u2", kind: "docs", text: "3 documents digitised and uploaded" },
        { at: "2026-11-06T16:30:00", by: "u3", kind: "status", text: "Status changed to Documents Required" },
        { at: "2026-11-12T15:10:00", by: "u2", kind: "docs", text: "2 additional documents uploaded" },
        { at: "2026-11-14T10:10:00", by: "u3", kind: "status", text: "Status changed to Original Verification" },
        { at: "2026-11-20T12:07:00", by: "u2", kind: "verify", text: "2 of 5 documents marked Original Verified" }
      ]
    },

    /* ---------- 2. Pending: Documents Required ---------- */
    {
      id: "c2", fileNo: "PLS-2026-0143", title: "Recovery suit — unpaid invoices, Sheikh Traders",
      typeId: "ct2", clientId: "u7", paralegalId: "u2", lawyerId: "u3",
      createdAt: "2026-11-08T12:00:00", status: "Documents Required",
      description: "Recovery of ₹8.4 lakh against a distributor for unpaid invoices (Apr–Aug 2026).",
      advance: { amount: 25000, paid: true, mode: "Paid at office (Cash/Cheque)", paidOn: "2026-11-08T12:00:00", ref: "Receipt #0419" },
      final: { amount: 50000, paid: false },
      documents: [
        { id: "d6", fileTypeId: "ft8", name: "Current A/c statement — HDFC", refNo: "XXXX4471", fromDate: "2026-04-01", toDate: "2026-09-30", description: "Shows absence of credits from the distributor.", uploadedBy: "u2", uploadedAt: "2026-11-09T10:00:00", fileName: "hdfc_statement.pdf", ov: { verified: false }, remarks: [] },
        { id: "d7", fileTypeId: "ft15", name: "Tax invoices (12 nos.)", refNo: "INV-2604 to INV-2617", description: "Invoices raised on the distributor.", uploadedBy: "u2", uploadedAt: "2026-11-09T10:05:00", fileName: "invoices.pdf", ov: { verified: false }, remarks: [ { by: "u3", at: "2026-11-11T14:00:00", text: "Invoice INV-2611 is unsigned — need acknowledged copy." } ] }
      ],
      requirements: [
        { id: "r3", text: "Signed purchase orders from the distributor", fileTypeId: "ft15", by: "u3", at: "2026-11-11T14:05:00", status: "Open" },
        { id: "r4", text: "Copy of legal notice sent earlier (if any) with postal acknowledgement", fileTypeId: "ft15", by: "u3", at: "2026-11-11T14:06:00", status: "Open" }
      ],
      notes: [ { id: "n3", by: "u3", at: "2026-11-11T14:10:00", text: "Limitation is fine. Consider Order XXXVII summary suit if POs are signed." } ],
      reviews: [ { id: "rv3", by: "u3", at: "2026-11-11T14:12:00", status: "Documents Required", remarks: "Please share signed POs and any earlier notice.", attachments: [] } ],
      timeline: [
        { at: "2026-11-08T12:00:00", by: "u2", kind: "created", text: "Case created; advance marked paid at office" },
        { at: "2026-11-09T10:05:00", by: "u2", kind: "docs", text: "2 documents uploaded" },
        { at: "2026-11-11T14:12:00", by: "u3", kind: "status", text: "Status changed to Documents Required" }
      ]
    },

    /* ---------- 3. Pending: Awaiting Documents, advance NOT paid ---------- */
    {
      id: "c3", fileNo: "PLS-2026-0147", title: "Probate of Will — Late Sri. Narayan Kumar",
      typeId: "ct4", clientId: "u5", paralegalId: "u2", lawyerId: "u3",
      createdAt: "2026-11-21T11:30:00", status: "Awaiting Documents",
      description: "Probate petition for the registered will of the client's father.",
      advance: { amount: 7500, paid: false },
      final: { amount: 20000, paid: false },
      documents: [],
      requirements: [],
      notes: [], reviews: [],
      timeline: [ { at: "2026-11-21T11:30:00", by: "u2", kind: "created", text: "Case created; awaiting advance and initial documents" } ]
    },

    /* ---------- 4. Closed: Resolved, final NOT paid ---------- */
    {
      id: "c4", fileNo: "PLS-2026-0128", title: "Rental agreement review — Whitefield flat",
      typeId: "ct6", clientId: "u6", paralegalId: "u2", lawyerId: "u4",
      createdAt: "2026-10-14T09:00:00", status: "Resolved", closedAt: "2026-10-22T17:30:00",
      description: "Review of 11-month leave-and-licence agreement before signing.",
      advance: { amount: 0, paid: true, mode: "Not applicable" },
      final: { amount: 2500, paid: false },
      finalReport: { fileName: "Opinion_PLS-2026-0128.pdf", by: "u4", at: "2026-10-22T17:30:00" },
      documents: [
        { id: "d8", fileTypeId: "ft9", name: "Draft Leave & Licence Agreement", refNo: "Draft v2", fromDate: "2026-11-01", toDate: "2027-09-30", description: "Draft shared by landlord's agent.", uploadedBy: "u2", uploadedAt: "2026-10-14T09:20:00", fileName: "draft_agreement.pdf", ov: { verified: false }, remarks: [ { by: "u4", at: "2026-10-20T11:00:00", text: "Clause 9 (lock-in) is one-sided. Suggested revision in opinion." } ] }
      ],
      requirements: [], notes: [ { id: "n4", by: "u4", at: "2026-10-20T11:05:00", text: "Deposit of 10 months is above market; recommend negotiating.", shared: true } ],
      reviews: [ { id: "rv4", by: "u4", at: "2026-10-22T17:30:00", status: "Resolved", remarks: "Review complete. Please see attached opinion with suggested clause changes.", attachments: ["Opinion_PLS-2026-0128.pdf"] } ],
      timeline: [
        { at: "2026-10-14T09:00:00", by: "u2", kind: "created", text: "Case created" },
        { at: "2026-10-14T09:20:00", by: "u2", kind: "docs", text: "1 document uploaded" },
        { at: "2026-10-22T17:30:00", by: "u4", kind: "status", text: "Case Resolved — final opinion attached" }
      ]
    },

    /* ---------- 5. Closed: Resolved & paid ---------- */
    {
      id: "c5", fileNo: "PLS-2026-0112", title: "Legal notice — security deposit refund",
      typeId: "ct5", clientId: "u5", paralegalId: "u2", lawyerId: "u3",
      createdAt: "2026-09-18T10:00:00", status: "Resolved", closedAt: "2026-09-25T16:00:00",
      description: "Notice to former landlord for refund of ₹1.2 lakh deposit.",
      advance: { amount: 0, paid: true, mode: "Not applicable" },
      final: { amount: 3500, paid: true, paidOn: "2026-09-26T10:30:00", mode: "Online (Card)", ref: "CARD-4471-990" },
      finalReport: { fileName: "Legal_Notice_PLS-2026-0112.pdf", by: "u3", at: "2026-09-25T16:00:00" },
      documents: [
        { id: "d9", fileTypeId: "ft9", name: "Rental Agreement 2023–24", refNo: "Stamp No. KA-88213", fromDate: "2023-06-01", toDate: "2024-04-30", description: "Registered rental agreement.", uploadedBy: "u2", uploadedAt: "2026-09-18T10:30:00", fileName: "rental_2023.pdf", ov: { verified: false }, remarks: [] }
      ],
      requirements: [], notes: [],
      reviews: [ { id: "rv5", by: "u3", at: "2026-09-25T16:00:00", status: "Resolved", remarks: "Legal notice dispatched by RPAD. Copy attached.", attachments: ["Legal_Notice_PLS-2026-0112.pdf"] } ],
      timeline: [
        { at: "2026-09-18T10:00:00", by: "u2", kind: "created", text: "Case created" },
        { at: "2026-09-25T16:00:00", by: "u3", kind: "status", text: "Case Resolved — notice attached" },
        { at: "2026-09-26T10:30:00", by: "u5", kind: "payment", text: "Final payment of ₹3,500 received" }
      ]
    },

    /* ---------- 6. In progress: Under Review ---------- */
    {
      id: "c6", fileNo: "PLS-2026-0145", title: "Mutual consent divorce — Nair",
      typeId: "ct3", clientId: "u6", paralegalId: "u2", lawyerId: "u4",
      createdAt: "2026-11-15T14:00:00", status: "Under Review",
      description: "Petition under Sec. 13B HMA. Both parties agreed on terms.",
      advance: { amount: 15000, paid: true, mode: "Online (Net banking)", paidOn: "2026-11-15T18:20:00", ref: "NB-77120019" },
      final: { amount: 35000, paid: false },
      documents: [
        { id: "d10", fileTypeId: "ft7", name: "Marriage Certificate", refNo: "MR/BLR/2017/2211", description: "", uploadedBy: "u2", uploadedAt: "2026-11-17T10:00:00", fileName: "marriage_cert.pdf", ov: { verified: false }, remarks: [] },
        { id: "d11", fileTypeId: "ft5", name: "Aadhaar — Petitioner 1", refNo: "XXXX XXXX 4410", description: "", uploadedBy: "u2", uploadedAt: "2026-11-17T10:02:00", fileName: "aadhaar_p1.pdf", ov: { verified: false }, remarks: [] },
        { id: "d12", fileTypeId: "ft5", name: "Aadhaar — Petitioner 2", refNo: "XXXX XXXX 9021", description: "", uploadedBy: "u2", uploadedAt: "2026-11-17T10:03:00", fileName: "aadhaar_p2.pdf", ov: { verified: false }, remarks: [] }
      ],
      requirements: [], notes: [], reviews: [],
      timeline: [
        { at: "2026-11-15T14:00:00", by: "u2", kind: "created", text: "Case created" },
        { at: "2026-11-15T18:20:00", by: "u6", kind: "payment", text: "Advance of ₹15,000 paid online" },
        { at: "2026-11-17T10:03:00", by: "u2", kind: "docs", text: "3 documents uploaded and sent for lawyer review" }
      ]
    },

    /* ---------- 7. Pending: Awaiting documents (advance paid) ---------- */
    {
      id: "c7", fileNo: "PLS-2026-0148", title: "Title verification — Apartment 1204, Sobha Dream Acres",
      typeId: "ct1", clientId: "u8", paralegalId: "u2", lawyerId: "u3",
      createdAt: "2026-11-24T16:00:00", status: "Awaiting Documents",
      description: "Resale apartment purchase; bank loan sanction pending legal opinion.",
      advance: { amount: 5000, paid: true, mode: "Paid at office (Cash/Cheque)", paidOn: "2026-11-24T16:00:00", ref: "Receipt #0433" },
      final: { amount: 15000, paid: false },
      documents: [
        { id: "d13", fileTypeId: "ft1", name: "Sale Deed — Builder to First Owner", refNo: "VRT-1-08812/2019", description: "", uploadedBy: "u2", uploadedAt: "2026-11-25T11:00:00", fileName: "sale_deed_2019.pdf", ov: { verified: false }, remarks: [] }
      ],
      requirements: [], notes: [], reviews: [],
      timeline: [
        { at: "2026-11-24T16:00:00", by: "u2", kind: "created", text: "Case created; advance marked paid at office" },
        { at: "2026-11-25T11:00:00", by: "u2", kind: "docs", text: "1 document uploaded" }
      ]
    }
  ],

  notifications: [
    { id: "nt1", to: "u5", caseId: "c1", title: "Original Verification requested", body: "File PLS-2026-0141: please bring all original documents to the office for verification.", at: "2026-11-14T10:10:00", channels: ["in-app","email","sms"], read: true },
    { id: "nt2", to: "u5", caseId: "c3", title: "A new case has been added to your profile", body: "File PLS-2026-0147 (Will & Probate) has been created. An advance of ₹7,500 is due.", at: "2026-11-21T11:30:00", channels: ["in-app","email","sms"], read: false },
    { id: "nt3", to: "u5", caseId: "c1", title: "Original Verification in progress", body: "File PLS-2026-0141: 2 documents have been Original Verified.", at: "2026-11-20T12:07:00", channels: ["in-app","email"], read: false },
    { id: "nt4", to: "u7", caseId: "c2", title: "Action needed on your file", body: "File PLS-2026-0143: Adv. Raghav Iyer has requested further documents.", at: "2026-11-11T14:12:00", channels: ["in-app","email","sms"], read: false },
    { id: "nt5", to: "u6", caseId: "c4", title: "Your file has an update from the lawyer", body: "File PLS-2026-0128 has been Resolved. Complete the final payment to view the report.", at: "2026-10-22T17:30:00", channels: ["in-app","email","sms"], read: false },
    { id: "nt6", to: "u3", caseId: "c6", title: "New documents for review", body: "File PLS-2026-0145: 3 documents uploaded by Kavya Menon.", at: "2026-11-17T10:03:00", channels: ["in-app"], read: false },
    { id: "nt7", to: "u2", caseId: "c2", title: "Lawyer requested documents", body: "File PLS-2026-0143: 2 new document requirements.", at: "2026-11-11T14:12:00", channels: ["in-app"], read: false },
    { id: "nt8", to: "u2", caseId: "c1", title: "Original Verification requested", body: "File PLS-2026-0141 is ready for Original Verification.", at: "2026-11-14T10:10:00", channels: ["in-app"], read: true }
  ]
};
