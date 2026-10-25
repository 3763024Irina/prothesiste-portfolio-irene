(() => {
  const lang = document.body.dataset.lang === "fr" ? "fr" : "ru";
  const works = Array.isArray(window.PORTFOLIO_WORKS) ? window.PORTFOLIO_WORKS : [];
  const grid = document.getElementById("works-grid");
  const count = document.getElementById("works-count");
  const labels = lang === "fr"
    ? { fixed: "Fixe", implant: "Sur implants", removable: "Amovible", digital: "Numérique", demo: "Exemple de maquette" }
    : { fixed: "Несъёмная работа", implant: "Работа на имплантах", removable: "Съёмная работа", digital: "Цифровой дизайн", demo: "Демонстрационный пример" };

  const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function render(filter = "all") {
    if (!grid) return;
    const shown = works.filter(w => filter === "all" || w.category === filter);
    grid.innerHTML = shown.map(w => {
      const imagePath = lang === "fr" ? `../${w.image}` : w.image;
      return `
      <article class="work-card">
        <div class="work-image">
          <img src="${escapeHTML(imagePath)}" alt="${escapeHTML(w.title?.[lang])}" loading="lazy" width="900" height="640">
          <span class="demo-badge">${escapeHTML(w.note?.[lang] || labels.demo)}</span>
          <span class="work-num">${escapeHTML(w.id)}</span>
        </div>
        <div class="work-body">
          <div class="work-meta"><span>${escapeHTML(w.type?.[lang])}</span><span>${escapeHTML(w.id)}</span></div>
          <h3>${escapeHTML(w.title?.[lang])}</h3>
          <p>${escapeHTML(w.description?.[lang])}</p>
          <div class="work-tags">${(w.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
        </div>
      </article>`;
    }).join("");
    if (count) count.textContent = String(shown.length).padStart(2, "0");
  }
  render();
  document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(x => x.classList.toggle("is-active", x === btn));
    render(btn.dataset.filter || "all");
  }));

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    }));
  }

  const cfg = window.PORTFOLIO_CONFIG || {};
  const emailBtn = document.querySelector('[data-contact="email"]');
  const whatsappBtn = document.querySelector('[data-contact="whatsapp"]');
  const hint = document.getElementById("contact-hint");
  let contactReady = false;
  if (emailBtn && typeof cfg.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email.trim())) {
    emailBtn.href = `mailto:${encodeURIComponent(cfg.email.trim())}`;
    emailBtn.classList.remove("is-disabled"); emailBtn.removeAttribute("aria-disabled"); contactReady = true;
  } else if (emailBtn) { emailBtn.classList.add("is-disabled"); emailBtn.href = "#contact"; emailBtn.setAttribute("aria-disabled", "true"); }
  const phone = String(cfg.whatsapp || "").replace(/\D/g, "");
  if (whatsappBtn && phone.length >= 8) {
    const msg = lang === "fr" ? "Bonjour, je souhaiterais discuter d'une collaboration en prothèse dentaire." : "Здравствуйте! Хочу обсудить сотрудничество по зуботехническим работам.";
    whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    whatsappBtn.target = "_blank"; whatsappBtn.rel = "noopener noreferrer";
    whatsappBtn.classList.remove("is-disabled"); whatsappBtn.removeAttribute("aria-disabled"); contactReady = true;
  } else if (whatsappBtn) { whatsappBtn.classList.add("is-disabled"); whatsappBtn.href = "#contact"; whatsappBtn.setAttribute("aria-disabled", "true"); }
  if (hint && contactReady) hint.hidden = true;
})();
