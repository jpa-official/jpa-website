/* ============================================
   JUNGLIM PLANNING ADVISORY ©2026
   Motion & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  const canvas = document.getElementById('loaderCanvas');

  /* 캔버스 없는 페이지(about, projects 등)는 로더 즉시 숨김 */
  if (!canvas) {
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }
  } else {
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const _logoReady = new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = window.JPA_LOGO_B64;
  });

  _logoReady.then(logoImg => {
    const cW = canvas.width;
    const cH = canvas.height;

    /* --- 실제 로고 이미지에서 점 좌표 샘플링 --- */
    const sW  = Math.min(Math.round(cW * 0.52), 480);
    const sH  = Math.round(sW * logoImg.naturalHeight / logoImg.naturalWidth);
    const sc  = document.createElement('canvas');
    sc.width  = sW;
    sc.height = sH;
    const sCtx = sc.getContext('2d');
    sCtx.drawImage(logoImg, 0, 0, sW, sH);

    const px  = sCtx.getImageData(0, 0, sW, sH).data;
    const raw = [];
    for (let y = 0; y < sH; y += 6) {
      for (let x = 0; x < sW; x += 6) {
        const i = (y * sW + x) * 4;
        if (px[i + 3] > 120 && px[i] < 100) raw.push([x, y]);
      }
    }

    /* 셔플 */
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    const sample = raw;
    const ox = Math.round((cW - sW) / 2);
    const oy = Math.round((cH - sH) / 2);

    /* 파티클: 사방에서 Bezier 곡선으로 수렴 */
    const particles = sample.map(([tx, ty]) => {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 160 + Math.random() * Math.max(cW, cH) * 0.4;
      const sx    = cW / 2 + Math.cos(angle) * dist;
      const sy    = cH / 2 + Math.sin(angle) * dist;
      const ftx   = tx + ox;
      const fty   = ty + oy;
      return {
        sx, sy,
        tx: ftx, ty: fty,
        cpX: (sx + ftx) / 2 + (Math.random() - 0.5) * 260,
        cpY: (sy + fty) / 2 + (Math.random() - 0.5) * 200,
        delay: Math.random() * 0.2,
        size:  Math.random() * 3 + 4
      };
    });

    const DURATION = 1600;
    let t0 = null;
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function frame(ts) {
      if (!t0) t0 = ts;
      const prog = Math.min((ts - t0) / DURATION, 1);

      ctx.clearRect(0, 0, cW, cH);

      particles.forEach(p => {
        const local = Math.max(0, (prog - p.delay) / (1 - p.delay));
        const e     = easeOut(Math.min(local, 1));
        const mt    = 1 - e;
        const x     = mt * mt * p.sx + 2 * mt * e * p.cpX + e * e * p.tx;
        const y     = mt * mt * p.sy + 2 * mt * e * p.cpY + e * e * p.ty;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + e * 0.8})`;
        ctx.fill();
      });

      if (prog < 1) {
        requestAnimationFrame(frame);
      } else {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        triggerHero();
      }
    }

    requestAnimationFrame(frame);
  }); // _logoReady.then
  } // canvas 존재 시 블록 끝

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
