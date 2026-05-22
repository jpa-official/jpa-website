/* ============================================
   JUNGLIM PLANNING ADVISORY ©2026
   Motion & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader      = document.getElementById('loader');
  const gif         = document.getElementById('loaderGif');
  const logoEl      = document.getElementById('loaderLogo');
  const enterPrompt = document.getElementById('loaderEnter');

  if (loader && gif) {
    /* GIF 로더 페이지 (index.html) */
    let clicked = false;

    /* 2초 후 CLICK TO ENTER 힌트 표시 */
    setTimeout(() => {
      if (enterPrompt) enterPrompt.classList.add('visible');
    }, 2000);

    function onEnter() {
      if (clicked) return;
      clicked = true;
      loader.removeEventListener('click',    onEnter);
      loader.removeEventListener('touchend', onEnter);

      /* 힌트 숨김 */
      if (enterPrompt) enterPrompt.classList.remove('visible');

      /* GIF 페이드 아웃 */
      gif.style.opacity = '0';

      /* 로고 페이드 인 */
      setTimeout(() => {
        if (logoEl) logoEl.style.opacity = '1';
      }, 300);

      /* 로고 잠깐 보인 뒤 메인 페이지 진입 */
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        triggerHero();
      }, 1300);
    }

    loader.addEventListener('click',    onEnter);
    loader.addEventListener('touchend', onEnter, { passive: true });

  } else if (loader) {
    /* 캔버스/GIF 없는 다른 페이지 — 로더 즉시 숨김 */
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

    window.PROJECTS.slice(0, 4).forEach(p => {
      const article = document.createElement('article');
      article.className = 'project-card reveal';

      if (p.thumbnail) {
        article.innerHTML = `
          <a href="project.html?id=${p.id}" class="project-link">
            <div class="project-visual">
              <img src="${p.thumbnail}" alt="${p.name}" class="project-img" loading="lazy">
              <div class="project-overlay"></div>
            </div>
            <div class="project-meta">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
            </div>
          </a>`;
      } else {
        article.innerHTML = `
          <a href="project.html?id=${p.id}" class="project-link">
            <div class="project-visual">
              <div class="visual-layer layer-1"></div>
              <div class="visual-layer layer-2"></div>
              <div class="visual-shape"></div>
            </div>
            <div class="project-meta">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
            </div>
          </a>`;
      }

      frag.appendChild(article);
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

  document.querySelectorAll('.reveal, .contact, .site-footer').forEach(el => io.observe(el));

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
