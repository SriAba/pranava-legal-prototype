/* =========================================================
   Pranava Legal Solutions — Shared prototype logic
   - Data store (localStorage, falls back to memory)
   - Session / role handling
   - App shell (sidebar, top bar, profile card, notifications)
   - Helpers: formatting, badges, modals, toasts, file inputs
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Icons (inline SVG, stroke style) ---------------- */
  const P = {
    cases: '<path d="M3 7h18v13H3z"/><path d="M8 7V4h8v3"/><path d="M3 12h18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    upload: '<path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.5 0 4.5 1.5 4.5 4"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',
    files: '<path d="M15 3H8v14h11V7z"/><path d="M15 3v4h4"/><path d="M5 7v14h10"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    folderOpen: '<path d="M3 6h6l2 2h10v4"/><path d="M3 6v13h16l3-7H6l-3 7"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    note: '<path d="M4 4h16v12l-4 4H4z"/><path d="M16 20v-4h4M8 9h8M8 13h5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    logout: '<path d="M15 4h4v16h-4"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    rupee: '<path d="M6 4h12M6 9h12M6 4c6 0 8 2 8 5s-3 5-8 5l8 7"/>',
    download: '<path d="M12 4v12M6 10l6 6 6-6"/><path d="M4 20h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    paperclip: '<path d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>',
    message: '<path d="M4 4h16v12H8l-4 4z"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    bank: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    upi: '<path d="M7 4l5 16M12 4l5 16"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>'
  };
  function icon(name, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' + (extra || "") + ">" + (P[name] || P.file) + "</svg>";
  }

  /* ---------------- Storage ---------------- */
  const KEY = "pls_proto_db";
  const SKEY = "pls_proto_session";
  let mem = {};
  const ls = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return mem[k] || null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { window.localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));
  let db;
  function load() {
    const raw = ls.get(KEY);
    if (raw) {
      try { db = JSON.parse(raw); } catch (e) { db = null; }
    }
    if (!db || db.version !== window.PLS_SEED.version) { db = clone(window.PLS_SEED); save(); }
    return db;
  }
  function save() {
    try { ls.set(KEY, JSON.stringify(db)); }
    catch (e) { toast("Storage full", "The uploaded file was too large to keep in this demo. Its name was saved."); }
  }
  function reset() { ls.del(KEY); load(); }
  load();

  /* ---------------- Lookups ---------------- */
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const user = (id) => byId(db.users, id) || { name: "Unknown", role: "" };
  const caseType = (id) => byId(db.caseTypes, id) || { name: "—" };
  const fileType = (id) => byId(db.fileTypes, id) || { name: "Other" };
  const getCase = (id) => byId(db.cases, id);
  const uid = (p) => (p || "id") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------------- Session ---------------- */
  function session() { const s = ls.get(SKEY); return s ? user(s) : null; }
  function login(u) { ls.set(SKEY, u.id); }
  function logout() { ls.del(SKEY); location.href = "index.html"; }
  function requireLogin(roles) {
    const me = session();
    if (!me || !me.id) { location.href = "index.html"; throw new Error("not logged in"); }
    if (roles && roles.indexOf(me.role) === -1) {
      document.body.innerHTML = '<div class="empty" style="padding:80px"><h2>No access</h2><p class="muted">This screen is not available for the ' + me.role + ' role.</p><p style="margin-top:16px"><a class="btn btn-primary" href="cases.html">Go to cases</a></p></div>';
      throw new Error("no access");
    }
    return me;
  }
  const isStaff = (me) => me && ["admin", "paralegal", "lawyer"].indexOf(me.role) > -1;
  const can = {
    addCase: (me) => ["admin", "paralegal", "lawyer"].indexOf(me.role) > -1,
    addDocs: (me) => ["admin", "paralegal"].indexOf(me.role) > -1,
    review: (me) => ["admin", "lawyer"].indexOf(me.role) > -1,
    verify: (me) => ["admin", "paralegal", "lawyer"].indexOf(me.role) > -1,
    config: (me) => me.role === "admin"
  };

  /* ---------------- Case status model ---------------- */
  const STATUS = {
    "Awaiting Documents":   { bucket: "pending",    cls: "b-amber" },
    "Documents Required":   { bucket: "pending",    cls: "b-red" },
    "Under Review":         { bucket: "inprogress", cls: "b-blue" },
    "Original Verification":{ bucket: "inprogress", cls: "b-purple" },
    "Resolved":             { bucket: "closed",     cls: "b-green" }
  };
  const bucketOf = (c) => (STATUS[c.status] || {}).bucket || "pending";
  const statusBadge = (s) => '<span class="badge ' + ((STATUS[s] || {}).cls || "b-gray") + '">' + esc(s) + "</span>";
  const BUCKET_LABEL = { pending: "Pending", inprogress: "In Progress", closed: "Closed" };

  function casesFor(me) {
    let list = db.cases.slice();
    if (me.role === "client") list = list.filter((c) => c.clientId === me.id);
    return list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }
  function ovSummary(c) {
    const t = caseType(c.typeId);
    if (!t.ovRequired) return { label: "Not required", cls: "b-gray", done: true, n: 0, total: 0 };
    const total = c.documents.length, n = c.documents.filter((d) => d.ov && d.ov.verified).length;
    if (!total) return { label: "No documents yet", cls: "b-gray", done: false, n, total };
    if (n === total) return { label: "Completed (" + n + "/" + total + ")", cls: "b-green", done: true, n, total };
    if (n === 0) return { label: c.status === "Original Verification" ? "Awaiting originals" : "Not started", cls: c.status === "Original Verification" ? "b-amber" : "b-gray", done: false, n, total };
    return { label: "In progress (" + n + "/" + total + ")", cls: "b-blue", done: false, n, total };
  }
  function advanceBadge(c) {
    const t = caseType(c.typeId);
    if (!t.advanceRequired || !c.advance || !c.advance.amount) return '<span class="badge b-gray">Not applicable</span>';
    return c.advance.paid ? '<span class="badge b-green">Paid · ' + money(c.advance.amount) + "</span>" : '<span class="badge b-red">Due · ' + money(c.advance.amount) + "</span>";
  }
  function addTimeline(c, by, kind, text) { c.timeline.push({ at: now(), by, kind, text }); }

  /* ---------------- Notifications (simulated email/SMS) ---------------- */
  function notify(toId, caseId, title, body, channels) {
    const n = { id: uid("nt"), to: toId, caseId, title, body, at: now(), channels: channels || ["in-app"], read: false };
    db.notifications.unshift(n);
    save();
    const u = user(toId);
    const ch = n.channels.map((x) => '<span class="ch">' + x.toUpperCase() + "</span>").join("");
    queueToast("Notification sent to " + u.name, ch + " " + esc(title));
    return n;
  }
  function notifyStaff(caseObj, title, body, excludeId) {
    [caseObj.paralegalId, caseObj.lawyerId].filter((x, i, a) => x && a.indexOf(x) === i && x !== excludeId).forEach((id) => notify(id, caseObj.id, title, body, ["in-app"]));
  }

  /* ---------------- Formatting ---------------- */
  function now() { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19); }
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function fmtDate(s) { if (!s) return "—"; const d = new Date(s); if (isNaN(d)) return s; return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); }
  function fmtDateTime(s) { if (!s) return "—"; const d = new Date(s); if (isNaN(d)) return s; let h = d.getHours(), m = String(d.getMinutes()).padStart(2, "0"), ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return fmtDate(s) + ", " + h + ":" + m + " " + ap; }
  function money(n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function initials(name) { return String(name || "?").replace(/^Adv\.\s*/, "").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase(); }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function ext(fn) { const m = /\.([a-z0-9]+)$/i.exec(fn || ""); return m ? m[1].toUpperCase().slice(0, 4) : "DOC"; }
  function nextFileNo() {
    const yr = new Date().getFullYear();
    const nums = db.cases.map((c) => parseInt((c.fileNo || "").split("-").pop(), 10) || 0);
    return db.settings.filePrefix + "-" + yr + "-" + String(Math.max(0, ...nums) + 1).padStart(4, "0");
  }

  /* ---------------- Shell ---------------- */
  const NAV = {
    admin: [
      ["Workspace"],
      ["cases", "Cases", "cases.html", "cases"],
      ["new-case", "New Case", "case-new.html", "plus"],
      ["add-docs", "Add Documents", "documents-add.html", "upload"],
      ["verify", "Original Verification", "verification.html", "shield"],
      ["Administration"],
      ["case-types", "Case Types", "admin-case-types.html", "tag"],
      ["file-types", "File Types", "admin-file-types.html", "files"],
      ["users", "Users", "admin-users.html", "users"],
      ["Account"],
      ["notifications", "Notifications", "notifications.html", "bell"],
      ["profile", "My Profile", "profile.html", "user"]
    ],
    paralegal: [
      ["Workspace"],
      ["cases", "Cases", "cases.html", "cases"],
      ["new-case", "New Case", "case-new.html", "plus"],
      ["add-docs", "Add Documents", "documents-add.html", "upload"],
      ["verify", "Original Verification", "verification.html", "shield"],
      ["Account"],
      ["notifications", "Notifications", "notifications.html", "bell"],
      ["profile", "My Profile", "profile.html", "user"]
    ],
    lawyer: [
      ["Workspace"],
      ["cases", "Cases", "cases.html", "cases"],
      ["new-case", "New Case", "case-new.html", "plus"],
      ["verify", "Original Verification", "verification.html", "shield"],
      ["Account"],
      ["notifications", "Notifications", "notifications.html", "bell"],
      ["profile", "My Profile", "profile.html", "user"]
    ],
    client: [
      ["My Files"],
      ["cases", "My Cases", "cases.html", "cases"],
      ["payments", "Payments", "payment.html", "card"],
      ["Account"],
      ["notifications", "Notifications", "notifications.html", "bell"],
      ["profile", "My Profile", "profile.html", "user"]
    ]
  };
  const ROLE_LABEL = { admin: "Admin", paralegal: "Paralegal", lawyer: "Lawyer", client: "Client" };

  function shell(opts) {
    const me = requireLogin(opts.roles);
    const unread = db.notifications.filter((n) => n.to === me.id && !n.read).length;
    const pendingCount = me.role === "client"
      ? casesFor(me).filter((c) => bucketOf(c) === "pending" || (c.advance && !c.advance.paid && c.advance.amount) || (c.status === "Resolved" && !c.final.paid)).length
      : db.cases.filter((c) => bucketOf(c) === "pending").length;

    const nav = NAV[me.role].map((it) => {
      if (it.length === 1) return '<div class="nav-section">' + it[0] + "</div>";
      const [key, label, href, ic] = it;
      let count = "";
      if (key === "cases" && pendingCount) count = '<span class="count" title="Needs attention">' + pendingCount + "</span>";
      if (key === "notifications" && unread) count = '<span class="count">' + unread + "</span>";
      return '<a class="nav-link ' + (opts.active === key ? "active" : "") + '" href="' + href + '">' + icon(ic) + "<span>" + label + "</span>" + count + "</a>";
    }).join("");

    const content = document.getElementById("page");
    const html =
      '<div class="app">' +
        '<aside class="sidebar">' +
          '<a class="brand" href="cases.html" title="Pranava Legal Solutions"><img src="assets/img/logo-light.svg" alt="Pranava Legal Solutions"></a>' +
          "<nav>" + nav + "</nav>" +
          '<div class="sidebar-foot">Prototype · sample data only<button id="resetDemo" type="button">Reset demo data</button></div>' +
        "</aside>" +
        '<div class="main">' +
          '<header class="topbar">' +
            '<div class="crumbs">' + (opts.crumbs || "") + "</div>" +
            '<div class="topbar-right">' +
              '<span class="role-pill">' + ROLE_LABEL[me.role] + "</span>" +
              '<button class="icon-btn" id="bellBtn" title="Notifications">' + icon("bell", 'width="18" height="18"') + (unread ? '<span class="dot">' + unread + "</span>" : "") + "</button>" +
              '<div class="user-chip" id="userChip" title="Profile"><div class="avatar">' + initials(me.name) + '</div><div class="who"><b>' + esc(me.name) + "</b><span>" + esc(me.title || ROLE_LABEL[me.role]) + "</span></div></div>" +
            "</div>" +
          "</header>" +
          '<main class="content" id="content"></main>' +
        "</div>" +
      "</div>" +
      '<div class="toast-wrap" id="toasts"></div>';
    const holder = document.createElement("div");
    holder.innerHTML = html;
    document.body.prepend(...holder.childNodes);
    const contentEl = document.getElementById("content");
    if (content) { contentEl.appendChild(content); content.style.display = ""; }

    document.getElementById("resetDemo").onclick = () => {
      if (confirm("Reset all demo data to the original sample cases? Anything you added will be removed.")) { reset(); location.reload(); }
    };
    document.getElementById("userChip").onclick = (e) => { e.stopPropagation(); togglePopover("profile", me); };
    document.getElementById("bellBtn").onclick = (e) => { e.stopPropagation(); togglePopover("notif", me); };
    document.addEventListener("click", (e) => { const p = document.querySelector(".popover"); if (p && !p.contains(e.target)) p.remove(); });
    flushToasts();
    return me;
  }

  function togglePopover(kind, me) {
    const existing = document.querySelector(".popover");
    const wasKind = existing && existing.dataset.kind;
    if (existing) existing.remove();
    if (wasKind === kind) return;
    const pop = document.createElement("div");
    pop.className = "popover" + (kind === "notif" ? " wide" : "");
    pop.dataset.kind = kind;
    if (kind === "profile") {
      pop.innerHTML =
        '<div class="profile-card"><div class="head"><div class="avatar lg">' + initials(me.name) + "</div><div><b>" + esc(me.name) + "</b><span>" + esc(me.title || ROLE_LABEL[me.role]) + "</span></div></div>" +
        '<div class="body"><div><span>Role</span><b>' + ROLE_LABEL[me.role] + "</b></div><div><span>Email</span><span>" + esc(me.email) + "</span></div><div><span>Phone</span><span>" + esc(me.phone) + "</span></div><div><span>Username</span><span class=\"mono\">" + esc(me.username) + "</span></div></div>" +
        '<div class="foot"><a class="btn btn-primary btn-sm" href="profile.html">' + icon("edit") + "Edit profile</a><button class=\"btn btn-outline btn-sm\" id=\"logoutBtn\">" + icon("logout") + "Sign out</button></div></div>";
      pop.querySelector("#logoutBtn").onclick = logout;
    } else {
      const list = db.notifications.filter((n) => n.to === me.id).slice(0, 8);
      pop.innerHTML =
        '<div class="popover-head"><h3>Notifications</h3><button class="btn btn-ghost btn-sm" id="markAll">Mark all read</button></div>' +
        '<div class="notif-list">' + (list.length ? list.map((n) =>
          '<div class="notif-item ' + (n.read ? "" : "unread") + '" data-id="' + n.id + '" data-case="' + (n.caseId || "") + '"><b>' + esc(n.title) + "</b><span>" + esc(n.body) + "</span><small>" + fmtDateTime(n.at) + " · " + n.channels.join(", ") + "</small></div>").join("") : '<div class="empty">You are all caught up.</div>') + "</div>" +
        '<div style="padding:10px 16px;text-align:center"><a href="notifications.html">View all notifications</a></div>';
      pop.querySelector("#markAll").onclick = () => { db.notifications.forEach((n) => { if (n.to === me.id) n.read = true; }); save(); location.reload(); };
      pop.querySelectorAll(".notif-item").forEach((el) => el.onclick = () => {
        const n = byId(db.notifications, el.dataset.id); n.read = true; save();
        if (el.dataset.case) location.href = "case.html?id=" + el.dataset.case;
      });
    }
    document.body.appendChild(pop);
  }

  /* ---------------- Toasts (survive page navigation) ---------------- */
  const TKEY = "pls_proto_toasts";
  function toast(title, body) {
    let wrap = document.getElementById("toasts");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; wrap.id = "toasts"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = icon("checkCircle", 'width="18" height="18" style="color:#FFC72C;flex-shrink:0"') + "<div><b>" + esc(title) + "</b>" + (body || "") + "</div>";
    wrap.appendChild(t);
    setTimeout(() => { t.style.transition = ".3s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 300); }, 4200);
  }
  function queueToast(title, body) {
    const list = JSON.parse(ls.get(TKEY) || "[]"); list.push([title, body]); ls.set(TKEY, JSON.stringify(list));
    if (document.getElementById("toasts")) flushToasts();
  }
  function flushToasts() {
    const list = JSON.parse(ls.get(TKEY) || "[]"); ls.del(TKEY);
    list.forEach((t, i) => setTimeout(() => toast(t[0], t[1]), i * 250));
  }

  /* ---------------- Modal ---------------- */
  function modal(opts) {
    const bd = document.createElement("div");
    bd.className = "modal-backdrop";
    bd.innerHTML = '<div class="modal ' + (opts.size || "") + '"><div class="modal-head"><h2>' + opts.title + '</h2><button class="close-x" data-close>&times;</button></div><div class="modal-body">' + opts.body + "</div>" + (opts.foot ? '<div class="modal-foot">' + opts.foot + "</div>" : "") + "</div>";
    const close = () => bd.remove();
    bd.addEventListener("click", (e) => { if (e.target === bd || e.target.hasAttribute("data-close")) close(); });
    document.body.appendChild(bd);
    if (opts.onOpen) opts.onOpen(bd, close);
    return { el: bd, close };
  }

  /* ---------------- Document viewer ---------------- */
  function viewDoc(doc, c) {
    const ft = fileType(doc.fileTypeId);
    let inner;
    if (doc.data && /^data:image\//.test(doc.data)) inner = '<img class="preview" src="' + doc.data + '" alt="">';
    else if (doc.data && /^data:application\/pdf/.test(doc.data)) inner = '<iframe src="' + doc.data + '"></iframe>';
    else {
      const lines = Array.from({ length: 14 }, (_, i) => '<div class="line" style="width:' + (60 + ((i * 37) % 40)) + '%"></div>').join("");
      inner = '<div class="paper">' + (doc.ov && doc.ov.verified ? '<div class="stamp ok">ORIGINAL VERIFIED</div>' : '<div class="stamp">SOFT COPY</div>') +
        "<h4>" + esc(ft.name.toUpperCase()) + '</h4><div class="sub">' + esc(doc.refNo || "") + (doc.fromDate ? " · " + fmtDate(doc.fromDate) + " – " + fmtDate(doc.toDate) : "") + "</div>" + lines + '<div class="seal">SEAL &amp;<br>SIGNATURE</div></div>';
    }
    modal({
      title: esc(doc.name), size: "xl",
      body: '<div class="row wrap" style="gap:18px;margin-bottom:14px;font-size:13px"><span><span class="muted">Type:</span> <b>' + esc(ft.name) + "</b></span>" +
        (doc.refNo ? '<span><span class="muted">Ref:</span> <b>' + esc(doc.refNo) + "</b></span>" : "") +
        (doc.fromDate ? '<span><span class="muted">Period:</span> <b>' + fmtDate(doc.fromDate) + " – " + fmtDate(doc.toDate) + "</b></span>" : "") +
        '<span><span class="muted">Uploaded:</span> <b>' + fmtDateTime(doc.uploadedAt) + "</b> by " + esc(user(doc.uploadedBy).name) + "</span>" +
        '<span><span class="muted">File:</span> <span class="mono">' + esc(doc.fileName || "—") + "</span></span></div>" +
        '<div class="viewer">' + inner + "</div>" +
        (doc.data ? "" : '<p class="muted small" style="margin-top:10px">Sample document — the prototype shows a placeholder page. Files you upload yourself (images or PDFs under 1 MB) open here for real.</p>'),
      foot: '<button class="btn btn-outline" data-close>Close</button>'
    });
  }

  /* ---------------- File input helper ---------------- */
  // Turns a .dropzone element into a file picker. Calls cb({fileName, data}) — data is kept only for small files.
  function dropzone(el, cb, opts) {
    opts = opts || {};
    const input = document.createElement("input");
    input.type = "file"; input.style.display = "none";
    if (opts.multiple) input.multiple = true;
    el.appendChild(input);
    const label = el.querySelector(".fname") || (() => { const d = document.createElement("div"); d.className = "fname"; el.appendChild(d); return d; })();
    el.addEventListener("click", (e) => { if (e.target !== input) input.click(); });
    el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("drag"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag"));
    el.addEventListener("drop", (e) => { e.preventDefault(); el.classList.remove("drag"); handle(e.dataTransfer.files); });
    input.addEventListener("change", () => handle(input.files));
    function handle(files) {
      const f = files && files[0];
      if (!f) return;
      label.textContent = f.name + " (" + Math.max(1, Math.round(f.size / 1024)) + " KB)";
      if (f.size < 1024 * 1024 && /^(image\/|application\/pdf)/.test(f.type)) {
        const r = new FileReader();
        r.onload = () => cb({ fileName: f.name, data: r.result });
        r.readAsDataURL(f);
      } else cb({ fileName: f.name, data: null });
    }
    return { clear() { label.textContent = ""; input.value = ""; } };
  }

  function options(arr, sel, placeholder) {
    return (placeholder ? '<option value="">' + placeholder + "</option>" : "") + arr.map((o) => '<option value="' + o.id + '"' + (o.id === sel ? " selected" : "") + ">" + esc(o.name) + "</option>").join("");
  }

  /* ---------------- Export ---------------- */
  window.PLS = {
    db: () => db, save, reset, load, icon, shell, session, login, logout, requireLogin, can, isStaff,
    user, caseType, fileType, getCase, byId, uid, casesFor, bucketOf, statusBadge, STATUS, BUCKET_LABEL,
    ovSummary, advanceBadge, addTimeline, notify, notifyStaff, toast, queueToast, modal, viewDoc, dropzone, options,
    fmtDate, fmtDateTime, money, esc, initials, qs, ext, now, nextFileNo, ROLE_LABEL
  };
})();
