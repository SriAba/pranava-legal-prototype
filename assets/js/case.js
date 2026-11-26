/* =========================================================
   Case overview — one screen, three experiences:
   - Paralegal / Admin: documents timeline, requirements, mark paid, verify
   - Lawyer / Admin: + workspace (notes, requirements, remarks, status submit)
   - Client: their file, lawyer updates, upload requested docs, payment gates
   ========================================================= */
(function () {
  "use strict";
  const id = PLS.qs("id");
  const c0 = PLS.getCase(id);
  const me = PLS.shell({
    active: "cases",
    crumbs: '<a href="cases.html">Cases</a> / <strong>' + (c0 ? c0.fileNo : "Not found") + "</strong>"
  });
  const { db, esc, icon, user, caseType, fileType, fmtDate, fmtDateTime, money, statusBadge, ovSummary, can, initials } = PLS;
  const $ = (s) => document.getElementById(s);
  const c = c0;

  if (!c || (me.role === "client" && c.clientId !== me.id)) {
    $("hero").innerHTML = '<div class="card"><div class="empty"><h2>Case not found</h2><p>It may have been removed, or you do not have access.</p><p style="margin-top:14px"><a class="btn btn-primary" href="cases.html">Back to cases</a></p></div></div>';
    return;
  }
  const t = caseType(c.typeId);
  const isClient = me.role === "client";
  const isLawyerView = can.review(me);

  /* ---------- Client payment gates ---------- */
  if (isClient && c.advance && c.advance.amount && !c.advance.paid) { location.replace("payment.html?id=" + c.id + "&type=advance"); return; }
  if (isClient && c.status === "Resolved" && !c.final.paid) { location.replace("payment.html?id=" + c.id + "&type=final"); return; }

  function rerender() { PLS.save(); render(); }

  /* ---------- Hero + stepper ---------- */
  function hero() {
    const ov = ovSummary(c);
    const steps = ["Case opened", "Documents", "Lawyer review"];
    if (t.ovRequired) steps.push("Original verification");
    steps.push("Resolved");
    let cur = 1;
    if (c.status === "Under Review" || c.status === "Documents Required") cur = 2;
    if (c.status === "Original Verification") cur = 3;
    if (c.status === "Resolved") cur = steps.length; // all done
    if (c.status === "Awaiting Documents") cur = c.documents.length ? 1 : 1;
    const stepper = steps.map((s, i) => '<div class="step ' + (i < cur ? "done" : i === cur ? "current" : "") + '"><span class="dot"></span>' + s + "</div>").join("");

    $("hero").innerHTML =
      '<div class="case-hero"><div class="row between wrap" style="position:relative;z-index:1">' +
        '<div><div class="file">' + c.fileNo + '</div><h1 style="margin-top:4px">' + esc(c.title) + '</h1></div>' +
        '<div class="row wrap"><span class="badge gold">' + esc(c.status) + '</span><span class="badge">' + esc(t.name) + "</span></div>" +
      "</div>" +
      '<div class="meta">' +
        (isClient ? "" : "<div><span>Client</span><b>" + esc(user(c.clientId).name) + "</b></div>") +
        "<div><span>Lawyer</span><b>" + esc(user(c.lawyerId).name) + "</b></div>" +
        "<div><span>Paralegal</span><b>" + esc(user(c.paralegalId).name) + "</b></div>" +
        "<div><span>Opened</span><b>" + fmtDate(c.createdAt) + "</b></div>" +
        "<div><span>Advance</span><b>" + (!c.advance.amount ? "Not applicable" : c.advance.paid ? "Paid · " + money(c.advance.amount) : "Due · " + money(c.advance.amount)) + "</b></div>" +
        "<div><span>Original verification</span><b>" + ov.label + "</b></div>" +
        "<div><span>Documents</span><b>" + c.documents.length + "</b></div>" +
      "</div></div>" +
      '<div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:16px 20px 14px"><div class="stepper">' + stepper + "</div></div></div>";
  }

  /* ---------- Alerts row ---------- */
  function alerts() {
    const out = [];
    const openReq = c.requirements.filter((r) => r.status === "Open");
    if (!isClient && c.advance.amount && !c.advance.paid) {
      out.push('<div class="callout warn">' + icon("card") + '<div style="flex:1"><b>Advance of ' + money(c.advance.amount) + " not yet received.</b> The client can pay online after signing in, or you can record a payment made at the office.</div>" +
        (can.addDocs(me) || isLawyerView ? '<button class="btn btn-gold btn-sm" id="markPaid">Mark as paid</button>' : "") + "</div>");
    }
    if (openReq.length) {
      if (isClient) {
        out.push('<div class="callout danger">' + icon("alert") + '<div style="flex:1"><b>Your lawyer needs more documents.</b> Upload a soft copy below, or bring them to the office and we will digitise them for you.</div></div>');
      } else {
        out.push('<div class="callout warn">' + icon("alert") + "<div style=\"flex:1\"><b>" + openReq.length + " open requirement" + (openReq.length > 1 ? "s" : "") + " from " + esc(user(c.lawyerId).name) + ":</b> " + openReq.map((r) => esc(r.text)).join("; ") + "</div>" + (can.addDocs(me) && c.status !== "Resolved" ? '<a class="btn btn-primary btn-sm" href="documents-add.html?case=' + c.id + '">' + icon("upload") + "Add documents</a>" : "") + "</div>");
      }
    }
    if (c.status === "Original Verification" && t.ovRequired) {
      const ov = ovSummary(c);
      out.push('<div class="callout info">' + icon("shield") + '<div style="flex:1">' + (isClient ? "<b>Original verification:</b> please bring the original documents to our office. " : "<b>Awaiting original verification.</b> ") + ov.n + " of " + ov.total + " documents verified so far.</div>" + (!isClient && can.verify(me) && !ov.done ? '<a class="btn btn-primary btn-sm" href="verification.html?case=' + c.id + '">' + icon("shield") + "Start verification</a>" : "") + "</div>");
    }
    $("alerts").innerHTML = out.join("");
    const mp = $("markPaid"); if (mp) mp.onclick = markPaidModal;
  }

  function markPaidModal() {
    PLS.modal({
      title: "Record advance payment",
      body: '<div class="stack"><div class="callout info">' + icon("info") + "<div>Use this when the client paid outside the application.</div></div>" +
        '<div class="form-grid"><div class="field"><label>Amount (₹)</label><input type="number" id="mpAmt" value="' + c.advance.amount + '"></div>' +
        '<div class="field"><label>Mode</label><select id="mpMode"><option>Paid at office (Cash/Cheque)</option><option>Bank transfer (NEFT/IMPS)</option><option>UPI at office</option></select></div>' +
        '<div class="field full"><label>Receipt / reference no.</label><input type="text" id="mpRef" placeholder="e.g. Receipt #0451"></div></div></div>',
      foot: '<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-success" id="mpSave">' + icon("check") + "Mark as paid</button>",
      onOpen: (el, close) => el.querySelector("#mpSave").onclick = () => {
        c.advance.amount = Number(el.querySelector("#mpAmt").value || c.advance.amount);
        c.advance.paid = true; c.advance.mode = el.querySelector("#mpMode").value; c.advance.ref = el.querySelector("#mpRef").value; c.advance.paidOn = PLS.now();
        PLS.addTimeline(c, me.id, "payment", "Advance of " + money(c.advance.amount) + " marked paid (" + c.advance.mode + ")");
        PLS.notify(c.clientId, c.id, "Advance payment received", "File " + c.fileNo + ": we have received your advance of " + money(c.advance.amount) + ". Thank you.", ["in-app", "email", "sms"]);
        close(); rerender();
      }
    });
  }

  /* ---------- Document card ---------- */
  function docCard(d) {
    const ft = fileType(d.fileTypeId);
    const ovBadge = !t.ovRequired ? "" : d.ov && d.ov.verified
      ? '<span class="badge b-green" title="Verified by ' + esc(user(d.ov.by).name) + " on " + fmtDateTime(d.ov.at) + '">Original verified</span>'
      : '<span class="badge b-gray">Not verified</span>';
    const canVerifyHere = !isClient && can.verify(me) && t.ovRequired && !(d.ov && d.ov.verified) && c.status !== "Resolved";
    const remarks = (d.remarks || []).map((r) => '<div class="remark"><div class="avatar blue">' + initials(user(r.by).name) + "</div><div><b>" + esc(user(r.by).name) + "</b><small>" + fmtDateTime(r.at) + "</small><div>" + esc(r.text) + "</div></div></div>").join("");
    const remarkForm = isLawyerView && c.status !== "Resolved" ? '<form class="remark-form" data-doc="' + d.id + '"><input type="text" placeholder="Add a remark on this document…"><button class="btn btn-outline btn-sm">Add</button></form>' : "";
    return '<div class="doc-card" id="doc-' + d.id + '"><div class="doc-top">' +
      '<div class="doc-thumb">' + icon("file") + '<span class="ext">' + PLS.ext(d.fileName) + "</span></div>" +
      '<div class="doc-info"><div class="row wrap" style="gap:8px"><h3>' + esc(d.name) + "</h3>" + ovBadge + "</div>" +
        '<div class="meta"><span>' + esc(ft.name) + "</span>" + (d.refNo ? "<span>Ref: " + esc(d.refNo) + "</span>" : "") +
        (d.fromDate ? "<span>Period: " + fmtDate(d.fromDate) + " – " + fmtDate(d.toDate) + "</span>" : "") +
        "<span>Uploaded " + fmtDateTime(d.uploadedAt) + " by " + esc(user(d.uploadedBy).name) + "</span></div>" +
        (d.description ? '<div class="desc">' + esc(d.description) + "</div>" : "") +
      "</div>" +
      '<div class="doc-actions"><button class="btn btn-outline btn-sm" data-view="' + d.id + '">' + icon("eye") + "View</button>" +
        (canVerifyHere ? '<button class="btn btn-success btn-sm" data-verify="' + d.id + '" title="Mark original verified">' + icon("shield") + "Verify</button>" : "") +
      "</div></div>" +
      (remarks || remarkForm ? '<div class="doc-remarks">' + remarks + remarkForm + "</div>" : "") +
      "</div>";
  }

  /* ---------- Chronological timeline: documents + events ---------- */
  function timelineHtml() {
    const items = [];
    c.documents.forEach((d) => items.push({ at: d.uploadedAt, type: "doc", d }));
    c.timeline.filter((e) => e.kind !== "docs").forEach((e) => {
      const rv = (c.reviews || []).find((r) => r.at === e.at);
      items.push({ at: e.at, type: "event", e, rv });
    });
    items.sort((a, b) => (a.at > b.at ? 1 : -1));

    const KIND = { created: ["plus", ""], payment: ["rupee", "gold"], status: ["send", "gold"], verify: ["shield", "green"], upload: ["upload", ""] };
    let lastDay = "";
    return '<div class="timeline">' + items.map((it) => {
      const day = fmtDate(it.at);
      const dayHdr = day !== lastDay ? ((lastDay = day), '<div class="tl-date" style="font-weight:700;color:var(--navy-800);margin-top:4px">' + day + "</div>") : "";
      if (it.type === "doc") {
        return '<div class="tl-item">' + '<div class="marker">' + icon("file") + "</div>" + dayHdr + docCard(it.d) + "</div>";
      }
      const k = KIND[it.e.kind] || ["info", ""];
      const rv = it.rv;
      const review = rv ? '<div class="card" style="margin-top:8px;border-left:3px solid var(--gold-500)"><div class="card-body" style="padding:12px 14px"><div class="row" style="gap:8px;margin-bottom:6px"><div class="avatar blue" style="width:26px;height:26px;font-size:11px">' + initials(user(rv.by).name) + "</div><b class=\"small\">" + esc(user(rv.by).name) + "</b>" + statusBadge(rv.status) + "</div><div style=\"font-size:13px\">" + esc(rv.remarks) + "</div>" +
        (rv.attachments && rv.attachments.length ? '<div class="row wrap" style="margin-top:8px">' + rv.attachments.map((a) => '<span class="chip" style="padding-right:10px">' + icon("paperclip", 'width="12" height="12"') + esc(a) + "</span>").join("") + "</div>" : "") + "</div></div>" : "";
      return '<div class="tl-item ' + k[1] + '"><div class="marker">' + icon(k[0]) + "</div>" + dayHdr + '<div class="tl-event"><span class="muted small">' + fmtDateTime(it.e.at).split(", ")[1] + "</span> · " + esc(it.e.text) + ' <span class="muted small">— ' + esc(user(it.e.by).name) + "</span></div>" + review + "</div>";
    }).join("") + "</div>";
  }

  function glanceHtml() {
    if (!c.documents.length) return "";
    return '<div class="card"><div class="card-head"><h2>All documents at a glance</h2><span class="muted small">' + c.documents.length + " documents · click to jump</span></div><div class=\"card-body\"><div class=\"glance\">" +
      c.documents.map((d) => '<div class="glance-item" data-jump="' + d.id + '"><div class="doc-thumb">' + icon("file") + '</div><div style="min-width:0"><b>' + esc(d.name.length > 38 ? d.name.slice(0, 36) + "…" : d.name) + "</b><small>" + esc(fileType(d.fileTypeId).name) + (t.ovRequired && d.ov && d.ov.verified ? " · ✓ OV" : "") + "</small></div></div>").join("") +
      "</div></div></div>";
  }

  function finalReportHtml() {
    if (c.status !== "Resolved") return "";
    const lastRv = (c.reviews || []).filter((r) => r.status === "Resolved").slice(-1)[0];
    const fr = c.finalReport;
    return '<div class="final-report"><div class="doc-thumb" style="width:54px;height:68px;border-color:var(--gold-500);color:var(--amber-700)">' + icon("file") + '<span class="ext" style="background:var(--gold-500);color:var(--navy-900)">PDF</span></div>' +
      '<div style="flex:1"><div class="small muted" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700">Final review · ' + fmtDate(c.closedAt) + "</div><h2 style=\"margin:2px 0 4px\">" + esc(fr ? fr.fileName : "Final opinion") + "</h2><div style=\"font-size:13px\">" + esc(lastRv ? lastRv.remarks : "") + "</div>" +
      (!isClient ? '<div class="small muted" style="margin-top:6px">Final fee: ' + money(c.final.amount) + " · " + (c.final.paid ? "Paid on " + fmtDate(c.final.paidOn) : "Awaiting client payment") + "</div>" : "") + "</div>" +
      '<button class="btn btn-gold" id="dlReport">' + icon("download") + "Download</button></div>";
  }

  /* ---------- Right column: paralegal ---------- */
  function paralegalPanel() {
    const openReq = c.requirements;
    const notes = c.notes || [];
    return '<div class="card"><div class="card-head"><h2>Quick actions</h2></div><div class="card-body stack">' +
      (c.status !== "Resolved" ? '<a class="btn btn-primary btn-block" href="documents-add.html?case=' + c.id + '">' + icon("upload") + "Add / update documents</a>" : "") +
      (t.ovRequired && c.status !== "Resolved" ? '<a class="btn btn-outline btn-block" href="verification.html?case=' + c.id + '">' + icon("shield") + "Original verification</a>" : "") +
      (c.advance.amount && !c.advance.paid ? '<button class="btn btn-gold btn-block" id="markPaid2">' + icon("card") + "Mark advance as paid</button>" : "") +
      "</div></div>" +
      reqCard(false) +
      '<div class="card"><div class="card-head"><h2>Lawyer\'s notes</h2></div><div class="card-body">' + (notes.length ? notes.map(noteHtml).join("") : '<p class="muted small">No notes yet.</p>') + "</div></div>" +
      paymentCard();
  }
  function noteHtml(n) { return '<div class="note">' + esc(n.text) + "<small>" + esc(user(n.by).name) + " · " + fmtDateTime(n.at) + (n.shared ? " · shared with client" : "") + "</small></div>"; }
  function reqCard(editable) {
    const list = c.requirements;
    return '<div class="card"><div class="card-head"><h2>Further documents required</h2><span class="badge b-' + (list.some((r) => r.status === "Open") ? "red" : "gray") + ' plain">' + list.filter((r) => r.status === "Open").length + " open</span></div><div class=\"card-body\" style=\"padding-top:6px;padding-bottom:6px\">" +
      (list.length ? list.map((r) => '<div class="req-item">' + icon(r.status === "Open" ? "clock" : "checkCircle", 'width="16" height="16" style="flex-shrink:0;margin-top:2px;color:' + (r.status === "Open" ? "var(--amber-700)" : "var(--green-600)") + '"') + "<div>" + esc(r.text) + '<div class="small muted">' + (r.fileTypeId ? esc(fileType(r.fileTypeId).name) + " · " : "") + "requested " + fmtDate(r.at) + "</div></div>" + '<span class="badge ' + (r.status === "Open" ? "b-amber" : "b-green") + '">' + r.status + "</span></div>").join("") : '<p class="muted small" style="padding:10px 0">No further documents requested.</p>') +
      "</div></div>";
  }
  function paymentCard() {
    return '<div class="card"><div class="card-head"><h2>Payments</h2></div><div class="card-body" style="padding-top:8px;padding-bottom:8px">' +
      '<div class="summary-row"><span>Advance</span><span>' + (!c.advance.amount ? '<span class="muted">N/A</span>' : money(c.advance.amount) + " " + (c.advance.paid ? '<span class="badge b-green">Paid</span>' : '<span class="badge b-red">Due</span>')) + "</span></div>" +
      (c.advance.paid && c.advance.amount ? '<div class="small muted" style="margin-top:-4px">' + esc(c.advance.mode || "") + (c.advance.ref ? " · " + esc(c.advance.ref) : "") + (c.advance.paidOn ? " · " + fmtDate(c.advance.paidOn) : "") + "</div>" : "") +
      '<div class="summary-row"><span>Final fee</span><span>' + money(c.final.amount) + " " + (c.final.paid ? '<span class="badge b-green">Paid</span>' : c.status === "Resolved" ? '<span class="badge b-red">Due</span>' : '<span class="badge b-gray">On resolution</span>') + "</span></div>" +
      "</div></div>";
  }

  /* ---------- Right column: lawyer workspace ---------- */
  function lawyerWorkspace() {
    const closed = c.status === "Resolved";
    const statuses = ["Under Review", "Documents Required"].concat(t.ovRequired ? ["Original Verification"] : []).concat(["Resolved"]);
    return '<div class="card workspace">' +
      '<div class="card-head"><h2>Lawyer workspace</h2>' + statusBadge(c.status) + "</div>" +

      '<div class="ws-section"><h3>' + icon("note") + "Notes</h3>" +
        '<div id="notesList">' + ((c.notes || []).length ? c.notes.map(noteHtml).join("") : '<p class="muted small" style="margin-bottom:8px">No notes yet.</p>') + "</div>" +
        (!closed ? '<form id="noteForm" class="stack" style="gap:8px"><textarea id="noteText" rows="2" placeholder="Write a note about this case…"></textarea><div class="row between"><label class="check small"><input type="checkbox" id="noteShared"><span>Visible to client</span></label><button class="btn btn-outline btn-sm">Add note</button></div></form>' : "") +
      "</div>" +

      '<div class="ws-section"><h3>' + icon("list") + "Further documents required</h3>" +
        (c.requirements.length ? c.requirements.map((r) => '<div class="req-item">' + icon(r.status === "Open" ? "clock" : "checkCircle", 'width="16" height="16" style="flex-shrink:0;margin-top:2px;color:' + (r.status === "Open" ? "var(--amber-700)" : "var(--green-600)") + '"') + "<div>" + esc(r.text) + '<div class="small muted">' + (r.fileTypeId ? esc(fileType(r.fileTypeId).name) + " · " : "") + fmtDate(r.at) + "</div></div>" + '<span class="badge ' + (r.status === "Open" ? "b-amber" : "b-green") + '">' + r.status + "</span>" + (r.status === "Open" && !closed ? '<button class="btn btn-ghost btn-sm" data-delreq="' + r.id + '" title="Remove">' + icon("trash", 'width="14" height="14"') + "</button>" : "") + "</div>").join("") : '<p class="muted small" style="margin-bottom:8px">Nothing requested yet.</p>') +
        (!closed ? '<form id="reqForm" class="stack" style="gap:8px;margin-top:10px"><div class="row"><select id="reqType" style="flex:1">' + PLS.options(db().fileTypes.filter((f) => f.active), null, "File type (optional)") + '</select></div><div class="row"><input type="text" id="reqText" placeholder="Describe the document needed"><button class="btn btn-outline btn-sm">' + icon("plus") + "Add</button></div></form>" : "") +
      "</div>" +

      (!closed && c.documents.length ? '<div class="ws-section"><h3>' + icon("message") + "Remark on a document</h3>" +
        '<form id="wsRemark" class="stack" style="gap:8px"><select id="wsDoc">' + c.documents.map((d) => '<option value="' + d.id + '">' + esc(d.name) + "</option>").join("") + '</select><div class="row"><input type="text" id="wsRemarkText" placeholder="Remark…"><button class="btn btn-outline btn-sm">Add</button></div></form></div>' : "") +

      (!closed ?
      '<div class="submit-panel"><div class="ws-section"><h3>' + icon("send") + "Update case status</h3>" +
        '<div class="stack" style="gap:12px">' +
          '<div class="field"><label>Status</label><select id="newStatus">' + statuses.map((s) => '<option' + (s === c.status ? " selected" : "") + ">" + s + "</option>").join("") + "</select></div>" +
          '<div class="field hidden" id="finalFeeBox"><label>Final fee (₹)</label><input type="number" id="finalFee" value="' + c.final.amount + '"><span class="small" style="color:rgba(255,255,255,.6)">Client must pay this before the final report unlocks.</span></div>' +
          '<div class="field"><label>Remarks to client</label><textarea id="statusRemarks" rows="3" placeholder="What has changed and what the client needs to do"></textarea></div>' +
          '<div class="field"><label id="attachLbl">Attach document (optional)</label><div class="dropzone" id="wsDz" style="padding:14px">' + icon("paperclip") + '<div class="small">Click or drop a file</div><div class="fname"></div></div></div>' +
          '<div class="small" style="color:rgba(255,255,255,.65)">' + icon("bell", 'width="13" height="13" style="vertical-align:-2px"') + " Client is notified by email, SMS and in-app.</div>" +
          '<button class="btn btn-gold btn-block btn-lg" id="submitStatus">Submit update</button>' +
        "</div></div></div>" : "") +
      "</div>" + (closed ? paymentCard() : "");
  }

  /* ---------- Client right panel ---------- */
  function clientPanel() {
    const shared = (c.notes || []).filter((n) => n.shared);
    const updates = (c.reviews || []).slice().reverse();
    const openReq = c.requirements.filter((r) => r.status === "Open");
    return (openReq.length ? '<div class="card" style="border-color:#F3C4C0"><div class="card-head" style="background:var(--red-100)"><h2>Documents requested</h2><span class="badge b-red plain">' + openReq.length + " pending</span></div><div class=\"card-body stack\">" +
      openReq.map((r) => '<div class="row between" style="gap:10px;align-items:flex-start"><div><b style="font-size:13px">' + esc(r.text) + '</b><div class="small muted">' + (r.fileTypeId ? esc(fileType(r.fileTypeId).name) + " · " : "") + "requested " + fmtDate(r.at) + '</div></div><button class="btn btn-primary btn-sm" data-upreq="' + r.id + '">' + icon("upload") + "Upload</button></div>").join("") +
      '<p class="small muted">Prefer to visit? Bring the documents to our office and we will add them for you.</p></div></div>' : "") +
      '<div class="card"><div class="card-head"><h2>Updates from your lawyer</h2></div><div class="card-body stack">' +
        (updates.length ? updates.map((rv) => '<div style="border-left:3px solid var(--gold-500);padding-left:12px"><div class="row between"><b style="font-size:13px">' + esc(user(rv.by).name) + "</b>" + statusBadge(rv.status) + '</div><div class="small muted">' + fmtDateTime(rv.at) + '</div><div style="font-size:13px;margin-top:4px">' + esc(rv.remarks) + "</div>" + (rv.attachments && rv.attachments.length ? '<div class="row wrap" style="margin-top:6px">' + rv.attachments.map((a) => '<span class="chip" style="padding-right:10px">' + icon("paperclip", 'width="12" height="12"') + esc(a) + "</span>").join("") + "</div>" : "") + "</div>").join("") : '<p class="muted small">No updates yet. We will notify you by email and SMS when there is news.</p>') +
      "</div></div>" +
      '<div class="card"><div class="card-head"><h2>Notes</h2></div><div class="card-body">' + (shared.length ? shared.map(noteHtml).join("") : '<p class="muted small">No notes shared yet.</p>') + "</div></div>" +
      paymentCard() +
      '<div class="card"><div class="card-body small muted">Questions about this file? Call the office on <b>+91 80 4000 1234</b> quoting <b class="mono">' + c.fileNo + "</b>.</div></div>";
  }

  /* ---------- Render ---------- */
  function render() {
    hero(); alerts();
    $("left").innerHTML =
      finalReportHtml() +
      glanceHtml() +
      '<div class="card"><div class="card-head"><h2>' + (isClient ? "Your file — timeline" : "Case timeline") + '</h2><span class="muted small">Oldest first · scroll for latest</span></div><div class="card-body">' +
        (c.description ? '<div class="callout info" style="margin-bottom:18px">' + icon("info") + "<div><b>Summary:</b> " + esc(c.description) + "</div></div>" : "") +
        timelineHtml() +
      "</div></div>";
    $("right").innerHTML = isClient ? clientPanel() : isLawyerView ? lawyerWorkspace() : paralegalPanel();
    wire();
  }

  function wire() {
    document.querySelectorAll("[data-view]").forEach((b) => b.onclick = () => PLS.viewDoc(c.documents.find((d) => d.id === b.dataset.view), c));
    document.querySelectorAll("[data-jump]").forEach((b) => b.onclick = () => {
      const el = $("doc-" + b.dataset.jump); if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("focus"); setTimeout(() => el.classList.remove("focus"), 1800);
    });
    document.querySelectorAll("[data-verify]").forEach((b) => b.onclick = () => verifyDoc(b.dataset.verify));
    document.querySelectorAll(".remark-form").forEach((f) => f.onsubmit = (e) => { e.preventDefault(); const v = f.querySelector("input").value.trim(); if (v) addRemark(f.dataset.doc, v); });
    const mp2 = $("markPaid2"); if (mp2) mp2.onclick = markPaidModal;
    const dl = $("dlReport"); if (dl) dl.onclick = () => PLS.toast("Download started", "In the live system the final report PDF downloads here.");

    // Lawyer workspace
    const nf = $("noteForm");
    if (nf) nf.onsubmit = (e) => {
      e.preventDefault(); const v = $("noteText").value.trim(); if (!v) return;
      c.notes = c.notes || []; c.notes.push({ id: PLS.uid("n"), by: me.id, at: PLS.now(), text: v, shared: $("noteShared").checked });
      PLS.toast("Note added", $("noteShared").checked ? "Visible to the client." : "Internal note."); rerender();
    };
    const rf = $("reqForm");
    if (rf) rf.onsubmit = (e) => {
      e.preventDefault(); const v = $("reqText").value.trim(); const ftId = $("reqType").value;
      if (!v && !ftId) return;
      c.requirements.push({ id: PLS.uid("r"), text: v || fileType(ftId).name, fileTypeId: ftId || undefined, by: me.id, at: PLS.now(), status: "Open" });
      PLS.toast("Requirement added", "Set status to “Documents Required” and submit to notify the client."); rerender();
      $("newStatus").value = "Documents Required"; $("newStatus").onchange();
    };
    document.querySelectorAll("[data-delreq]").forEach((b) => b.onclick = () => { c.requirements = c.requirements.filter((r) => r.id !== b.dataset.delreq); rerender(); });
    const wr = $("wsRemark");
    if (wr) wr.onsubmit = (e) => { e.preventDefault(); const v = $("wsRemarkText").value.trim(); if (v) addRemark($("wsDoc").value, v); };

    let attach = null;
    if ($("wsDz")) PLS.dropzone($("wsDz"), (f) => attach = f);
    const ns = $("newStatus");
    if (ns) {
      ns.onchange = () => {
        $("finalFeeBox").classList.toggle("hidden", ns.value !== "Resolved");
        $("attachLbl").textContent = ns.value === "Resolved" ? "Attach final report" : "Attach document (optional)";
      };
      ns.onchange();
      $("submitStatus").onclick = () => submitStatus(ns.value, $("statusRemarks").value.trim(), attach);
    }

    // Client uploads
    document.querySelectorAll("[data-upreq]").forEach((b) => b.onclick = () => clientUpload(b.dataset.upreq));
  }

  function addRemark(docId, text) {
    const d = c.documents.find((x) => x.id === docId);
    d.remarks = d.remarks || []; d.remarks.push({ by: me.id, at: PLS.now(), text });
    PLS.toast("Remark added", esc(d.name)); rerender();
    setTimeout(() => { const el = $("doc-" + docId); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("focus"); setTimeout(() => el.classList.remove("focus"), 1500); } }, 50);
  }

  function verifyDoc(docId) {
    const d = c.documents.find((x) => x.id === docId);
    d.ov = { verified: true, by: me.id, at: PLS.now() };
    const ov = ovSummary(c);
    PLS.addTimeline(c, me.id, "verify", "Original verified: " + d.name + " (" + ov.n + "/" + ov.total + ")");
    PLS.notify(c.clientId, c.id, ov.done ? "Original Verification completed" : "Document original verified", "File " + c.fileNo + ": " + (ov.done ? "all " + ov.total + " documents have been verified against originals." : d.name + " verified (" + ov.n + " of " + ov.total + ")."), ov.done ? ["in-app", "email", "sms"] : ["in-app", "email"]);
    if (ov.done) PLS.notify(c.lawyerId, c.id, "Original Verification completed", c.fileNo + " is ready for final review.", ["in-app"]);
    rerender();
  }

  function submitStatus(status, remarks, attach) {
    const openReq = c.requirements.filter((r) => r.status === "Open");
    if (status === "Documents Required" && !openReq.length) return PLS.toast("Add a requirement first", "List the documents the client needs to provide.");
    if (!remarks) return PLS.toast("Add remarks", "Tell the client what has changed.");
    if (status === "Resolved" && t.ovRequired && !ovSummary(c).done && !confirm("Original verification is not complete for this file. Resolve anyway?")) return;
    const at = PLS.now();
    const atts = [];
    if (attach) {
      atts.push(attach.fileName);
      c.documents.push({ id: PLS.uid("d"), fileTypeId: "ft14", name: (status === "Resolved" ? "Final report — " : "Attachment — ") + attach.fileName.replace(/\.[^.]+$/, ""), uploadedBy: me.id, uploadedAt: at, fileName: attach.fileName, data: attach.data, ov: { verified: false }, remarks: [], description: "Attached by " + me.name + " with status update." });
    }
    c.reviews = c.reviews || [];
    c.reviews.push({ id: PLS.uid("rv"), by: me.id, at, status, remarks, attachments: atts });
    c.timeline.push({ at, by: me.id, kind: "status", text: "Status changed to " + status });
    c.status = status;
    if (status === "Resolved") {
      c.closedAt = at; c.final.amount = Number($("finalFee").value || c.final.amount);
      c.finalReport = { fileName: attach ? attach.fileName : "Final_Opinion_" + c.fileNo + ".pdf", by: me.id, at };
    }
    const msg = {
      "Documents Required": ["Action needed on your file", "File " + c.fileNo + ": " + user(c.lawyerId).name + " has requested further documents. " + remarks],
      "Original Verification": ["Original Verification requested", "File " + c.fileNo + ": please bring the original documents to the office. " + remarks],
      "Resolved": ["Your file has an update from the lawyer", "File " + c.fileNo + " has been resolved. Complete the final payment of " + money(c.final.amount) + " to view the final report."],
      "Under Review": ["Your file has an update from the lawyer", "File " + c.fileNo + ": " + remarks]
    }[status];
    PLS.notify(c.clientId, c.id, msg[0], msg[1], ["in-app", "email", "sms"]);
    PLS.notifyStaff(c, "Status updated: " + status, c.fileNo + " — " + remarks, me.id);
    rerender();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clientUpload(reqId) {
    const r = c.requirements.find((x) => x.id === reqId);
    let file = null;
    PLS.modal({
      title: "Upload requested document",
      body: '<div class="stack"><div class="callout info">' + icon("info") + "<div><b>" + esc(r.text) + "</b></div></div>" +
        '<div class="field"><label>Document name</label><input type="text" id="cuName" value="' + esc(r.fileTypeId ? fileType(r.fileTypeId).name : r.text) + '"></div>' +
        (r.fileTypeId && fileType(r.fileTypeId).hasDateRange ? '<div class="form-grid"><div class="field"><label>From date</label><input type="date" id="cuFrom"></div><div class="field"><label>To date</label><input type="date" id="cuTo"></div></div>' : "") +
        '<div class="dropzone" id="cuDz">' + icon("upload") + "<div><b>Choose a file</b> or drag it here</div><div class=\"small\">PDF, JPG or PNG — a clear phone photo is fine</div><div class=\"fname\"></div></div></div>",
      foot: '<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="cuSave">' + icon("upload") + "Upload</button>",
      onOpen: (el, close) => {
        PLS.dropzone(el.querySelector("#cuDz"), (f) => file = f);
        el.querySelector("#cuSave").onclick = () => {
          if (!file) return PLS.toast("Choose a file", "Select the soft copy to upload.");
          const d = { id: PLS.uid("d"), fileTypeId: r.fileTypeId || "ft15", name: el.querySelector("#cuName").value || r.text, uploadedBy: me.id, uploadedAt: PLS.now(), fileName: file.fileName, data: file.data, ov: { verified: false }, remarks: [], description: "Uploaded by client against lawyer's request." };
          const fF = el.querySelector("#cuFrom"); if (fF) { d.fromDate = fF.value; d.toDate = el.querySelector("#cuTo").value; }
          c.documents.push(d); r.status = "Submitted"; r.docId = d.id;
          PLS.addTimeline(c, me.id, "upload", "Client uploaded: " + d.name);
          const stillOpen = c.requirements.filter((x) => x.status === "Open").length;
          if (!stillOpen && c.status === "Documents Required") { c.status = "Under Review"; c.timeline.push({ at: PLS.now(), by: me.id, kind: "status", text: "All requested documents submitted — back to Under Review" }); }
          PLS.notifyStaff(c, "Client uploaded a document", c.fileNo + ": " + d.name + (stillOpen ? "" : " — all requirements submitted"), null);
          close(); rerender();
        };
      }
    });
  }

  render();
})();
