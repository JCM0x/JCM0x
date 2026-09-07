// ================================================================
// ===== UI ENGINE — normalmente NO necesitas editar este archivo =====
// ================================================================

const $ = (selector) => document.querySelector(selector);
const esc = (value = "") => String(value).replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));

function externalLink(url, label, primary = false) {
  if (!url) return "";
  return `<a class="btn ${primary ? "btn-primary" : ""}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}

function renderProfile() {
  const p = PORTFOLIO_DATA.profile;
  $("#hero-name").textContent = p.displayName;
  $("#hero-role").textContent = p.role;
  $("#hero-tagline").textContent = p.tagline;
  $("#about-bio").textContent = p.bio;
  $("#status-focus").textContent = p.focus.toUpperCase();
  $("#profile-output").textContent = `profile.status = "${p.status}"\nprofile.focus = "${p.focus}"\nprofile.experience = "${p.experienceYears} years"\nprofile.metric = "${p.authorityMetric}"\nprofile.mode = "AUTHORIZED_LABS"`;
  $("#about-metrics").innerHTML = `
    <div class="metric"><strong>${esc(p.experienceYears)}</strong><span>years experience</span></div>
    <div class="metric"><strong>LEARN</strong><span>current status</span></div>
    <div class="metric"><strong>SOC</strong><span>primary focus</span></div>`;

  const links = PORTFOLIO_DATA.links;
  $("#hero-links").innerHTML = [
    externalLink(links.github, "GitHub", true),
    externalLink(links.tryhackme, "TryHackMe"),
    externalLink(links.hackthebox, "Hack The Box"),
    externalLink(links.linkedin, "LinkedIn"),
    externalLink(links.cv, "CV")
  ].join("");

  $("#contact-links").innerHTML = [
    externalLink(links.email ? `mailto:${links.email}` : "", "email"),
    externalLink(links.github, "github"),
    externalLink(links.tryhackme, "tryhackme"),
    externalLink(links.linkedin, "linkedin")
  ].join("");
}

function renderSkills() {
  $("#skills-grid").innerHTML = Object.entries(PORTFOLIO_DATA.skills).map(([category, skills]) => `
    <article class="skill-card">
      <h3>${esc(category)}</h3>
      <div class="chips">${skills.map((skill) => `<span class="chip">${esc(skill)}</span>`).join("")}</div>
    </article>`).join("");
}

function renderCertifications() {
  const certs = PORTFOLIO_DATA.certifications;
  if (!certs.length) {
    $("#certs-grid").innerHTML = `<div class="empty-state">CERTIFICATION VAULT // EMPTY — añade aquí únicamente certificaciones reales o formación que quieras verificar.</div>`;
    return;
  }
  $("#certs-grid").innerHTML = certs.map((cert) => `
    <article class="cert-card">
      <div><strong>${esc(cert.nombre)}</strong><p>${esc(cert.estado || "")}</p></div>
      <span>${esc(cert.año || "")} ${cert.verificacionUrl ? `· <a href="${esc(cert.verificacionUrl)}" target="_blank" rel="noopener noreferrer">VERIFY</a>` : ""}</span>
    </article>`).join("");
}

function renderProjects(filter = "ALL") {
  const projects = PORTFOLIO_DATA.projects;
  const filtered = filter === "ALL" ? projects : projects.filter((project) => (project.tags || []).includes(filter));
  $("#project-count").textContent = `${filtered.length} PROJECT${filtered.length === 1 ? "" : "S"}`;
  $("#status-projects").textContent = projects.length;
  if (!filtered.length) {
    $("#projects-grid").innerHTML = `<div class="empty-state">NO PUBLIC CASE STUDIES YET // Los primeros proyectos aparecerán aquí cuando documentes laboratorios reales.</div>`;
    return;
  }
  $("#projects-grid").innerHTML = filtered.map((project) => `
    <details class="project-card">
      <summary><div class="project-title"><h3>${esc(project.titulo)}</h3><span class="project-type">${esc(project.tipo)}</span></div></summary>
      <div class="project-body">
        <h4>Contexto / problema</h4><p>${esc(project.contexto)}</p>
        <h4>Qué hice / metodología</h4><p>${esc(project.metodologia)}</p>
        <h4>Herramientas y tecnologías</h4><div class="chips">${(project.herramientas || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>
        <h4>Resultado / impacto</h4><p>${esc(project.resultado)}</p>
        ${project.evidenciaUrl ? `<h4>Evidencia</h4><a class="btn" href="${esc(project.evidenciaUrl)}" target="_blank" rel="noopener noreferrer">open evidence</a>` : ""}
        <h4>Tags</h4><div class="chips">${(project.tags || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("")}</div>
      </div>
    </details>`).join("");
}

function renderFilters() {
  const tags = [...new Set(PORTFOLIO_DATA.projects.flatMap((p) => p.tags || []))];
  const all = ["ALL", ...tags];
  $("#project-filters").innerHTML = all.map((tag, index) => `<button class="filter-btn ${index === 0 ? "active" : ""}" data-filter="${esc(tag)}">${esc(tag)}</button>`).join("");
  $("#project-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
}

function renderWriteups() {
  const items = PORTFOLIO_DATA.writeups;
  $("#writeups-feed").innerHTML = items.length ? items.map((item) => `
    <article class="feed-item"><span class="feed-meta">${esc(item.plataforma || "PLATFORM")} · ${esc(item.dificultad || "")}</span><h3>${esc(item.titulo)}</h3><p>${esc(item.descripcion || "")}</p>${item.url ? `<a class="btn" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">read writeup</a>` : ""}</article>`).join("") : `<div class="empty-state">WRITEUP FEED // WAITING FOR FIRST LAB REPORT</div>`;
}

function renderTimeline() {
  $("#timeline-list").innerHTML = PORTFOLIO_DATA.experience.map((item) => `
    <article class="timeline-item"><span class="timeline-date">${esc(item.dates)}</span><h3>${esc(item.role)}</h3><span class="timeline-org">${esc(item.organization)}</span><ul>${(item.achievements || []).map((a) => `<li>${esc(a)}</li>`).join("")}</ul></article>`).join("");
}

function startTyping() {
  const lines = ["initializing SOC console...", "loading defensive profile...", "authorized learning environment detected.", "access granted."];
  let line = 0;
  let char = 0;
  const target = $("#typed-line");
  function tick() {
    if (line >= lines.length) { target.textContent = "monitoring // learning // documenting"; return; }
    target.textContent = lines[line].slice(0, char++);
    if (char > lines[line].length) { line++; char = 0; setTimeout(tick, 500); } else setTimeout(tick, 28);
  }
  tick();
}

function matrixRain() {
  const canvas = $("#matrix-canvas");
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  let columns, drops;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; columns = Math.floor(canvas.width / 18); drops = Array(columns).fill(1); }
  resize(); window.addEventListener("resize", resize);
  setInterval(() => {
    ctx.fillStyle = "rgba(5,7,10,.10)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "13px JetBrains Mono";
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = "#00fff5";
      ctx.fillText(Math.random() > .5 ? "1" : "0", i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }, 75);
}

function boot() {
  const screen = $("#boot-screen");
  const lines = ["[ OK ] loading portfolio kernel", "[ OK ] validating public profile", "[ OK ] initializing secure UI", "[ OK ] starting SOC console"];
  const box = $("#boot-lines"); const bar = $("#boot-bar");
  lines.forEach((text, i) => setTimeout(() => { const el = document.createElement("div"); el.className = "boot-line ok"; el.textContent = text; box.appendChild(el); bar.style.width = `${((i + 1) / lines.length) * 100}%`; }, i * 300));
  setTimeout(() => { screen.style.opacity = "0"; screen.style.transition = "opacity .4s"; $("#app").classList.remove("is-hidden"); setTimeout(() => screen.remove(), 450); startTyping(); }, 1450);
}

$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = PORTFOLIO_DATA.links.email;
  if (!email) { alert("Añade tu correo profesional en data.js para activar el canal de contacto."); return; }
  const subject = encodeURIComponent(`Portfolio contact — ${form.get("name") || "Guest"}`);
  const body = encodeURIComponent(`Name: ${form.get("name") || ""}\nEmail: ${form.get("email") || ""}\n\n${form.get("message") || ""}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});

renderProfile(); renderSkills(); renderCertifications(); renderProjects(); renderFilters(); renderWriteups(); renderTimeline(); matrixRain(); boot();
