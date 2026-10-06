/* ============================================
   JUNGLIM PLANNING ADVISORY ©2026
   Motion & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader     = document.getElementById('loader');
  const introVideo = document.getElementById('loaderVideo');

  if (loader && document.documentElement.classList.contains('skip-intro')) {
    /* index.html#contact (CONTACT 메뉴) — 인트로 없이 바로 CONTACT 섹션으로 */
    if (introVideo) introVideo.pause();
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    triggerHero();
    requestAnimationFrame(() => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView();
    });
  } else if (loader && introVideo) {
    /* 인트로 영상 자동 재생 페이지 (index.html) — 영상이 끝나면 메인 페이지 진입 */
    introVideo.play().catch(() => {});
    introVideo.addEventListener('ended', () => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
      triggerHero();
    }, { once: true });
  } else if (loader) {
    /* 다른 페이지 — 로더 즉시 숨김 */
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
  }

  /* ---------- HEADER HIDE ON SCROLL DOWN ---------- */
  const header = document.getElementById('siteHeader');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 100 && y > lastY) header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastY = y;
  });

  /* ---------- HERO REVEAL ---------- */
  function triggerHero() {
    document.querySelector('.hero').classList.add('in-view');
  }

  /* ---------- PARALLAX FOR HERO TITLE ---------- */
  const heroTitle = document.querySelector('.hero-title');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroTitle && y < window.innerHeight) {
      heroTitle.style.transform = `translateY(${y * 0.15}px)`;
      heroTitle.style.opacity = Math.max(0, 1 - y / 600);
    }
  });

  /* ---------- SERVICE ITEM TILT ---------- */
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      const title = item.querySelector('.srv-title');
      if (title) {
        title.style.transform = `translateX(${cy * 12}px)`;
      }
    });
    item.addEventListener('mouseleave', () => {
      const title = item.querySelector('.srv-title');
      if (title) title.style.transform = '';
    });

    /* click → services.html deep link */
    item.addEventListener('click', () => {
      const num = item.dataset.num;
      if (num) window.location.href = `services.html#sv-${num}`;
    });
  });

  /* ---------- HOME PROJECT GRID ---------- */
  (function renderHomeProjects() {
    const grid = document.getElementById('homeProjectGrid');
    if (!grid || !window.PROJECTS) return;

    const moreLink = grid.querySelector('.more-projects');
    const frag = document.createDocumentFragment();

    // PROJECTS 페이지 카드(js/projects.js buildCard)와 동일한 마크업·스타일(css/projects.css)
    window.PROJECTS.slice(0, 12).forEach(p => {
      const a = document.createElement('a');
      a.className = 'pj-item';
      a.href = `project.html?id=${encodeURIComponent(p.id)}`;

      const imgHtml = p.thumbnail
        ? `<img src="${p.thumbnail}" alt="${p.name}" loading="lazy">`
        : `<div class="pj-item-img-placeholder"></div>`;

      a.innerHTML = `
        <div class="pj-item-img">${imgHtml}</div>
        <div class="pj-item-info">
          <div class="pj-item-left">
            <h2 class="pj-item-name">${p.name}</h2>
            <p class="pj-item-desc">${p.desc}</p>
          </div>
          <span class="pj-item-cat">${p.category.toUpperCase()}</span>
        </div>`;

      frag.appendChild(a);
    });

    grid.insertBefore(frag, moreLink);
  })();

  /* ---------- INTERSECTION OBSERVER (카드 생성 후 등록) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .pj-item, .contact, .site-footer').forEach(el => io.observe(el));

  /* ---------- PROJECT CARD MOUSE TRACK ---------- */
  document.querySelectorAll('.project-card').forEach(card => {
    const visual = card.querySelector('.project-visual');
    if (!visual) return;
    card.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      visual.style.setProperty('--mx', `${px}%`);
      visual.style.setProperty('--my', `${py}%`);
    });
  });

  /* ---------- SMOOTH ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- COPYRIGHT YEAR DYNAMIC ---------- */
  // Already set to 2026 in markup

});
