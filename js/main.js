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

    /* --- 로고 이미지에서 점 좌표 샘플링 --- */
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
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    const ox = Math.round((cW - sW) / 2);
    const oy = Math.round((cH - sH) / 2);

    const isMobile = cW < 768;
    const particles = raw.map(([tx, ty]) => {
      const ftx   = tx + ox;
      const fty   = ty + oy;
      const angle = Math.random() * Math.PI * 2;
      const dist  = 140 + Math.random() * Math.max(cW, cH) * 0.38;
      const sx    = cW / 2 + Math.cos(angle) * dist;
      const sy    = cH / 2 + Math.sin(angle) * dist;
      return {
        sx, sy,
        tx: ftx, ty: fty,
        cpX: (sx + ftx) / 2 + (Math.random() - 0.5) * 240,
        cpY: (sy + fty) / 2 + (Math.random() - 0.5) * 180,
        /* wander oscillation params */
        ax:  8  + Math.random() * 16,
        ay:  6  + Math.random() * 14,
        wx:  0.25 + Math.random() * 0.55,
        wy:  0.20 + Math.random() * 0.60,
        phx: Math.random() * Math.PI * 2,
        phy: Math.random() * Math.PI * 2,
        size: isMobile ? Math.random() * 1.8 + 2 : Math.random() * 3 + 4,
        cx: sx, cy: sy   /* current drawn position, updated each frame */
      };
    });

    const CONVERGE_DUR = 1000;
    const SETTLE_DUR   = 500;
    const DISSOLVE_DUR = 1200;

    /* phase: 'converge' → 'wander' → 'settle' → 'dissolve' */
    let phase         = 'converge';
    let convergeStart = null;
    let wanderStart   = null;
    let settleStart   = null;
    let dissolveStart = null;

    function easeOut(t)    { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t)  { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
    function smoothstep(t) { return t * t * (3 - 2 * t); }

    const logoEl      = document.getElementById('loaderLogo');
    const enterPrompt = document.getElementById('loaderEnter');

    /* ---- 첫 번째 클릭: wander 중단 → settle 시작 ---- */
    let firstClicked = false;
    let hintShown    = false;

    function onFirstClick() {
      if (firstClicked) return;
      if (phase !== 'converge' && phase !== 'wander') return;
      firstClicked = true;
      loader.removeEventListener('click',    onFirstClick);
      loader.removeEventListener('touchend', onFirstClick);
      /* 현재 위치 스냅샷 → settle 보간 시작점 */
      particles.forEach(p => { p.snapX = p.cx; p.snapY = p.cy; });
      /* 첫 클릭 힌트 숨김 */
      if (enterPrompt && hintShown) {
        enterPrompt.classList.remove('visible');
      }
      phase = 'settle';
    }

    loader.addEventListener('click',    onFirstClick);
    loader.addEventListener('touchend', onFirstClick, { passive: true });

    /* ---- RAF 메인 루프 ---- */
    function frame(ts) {
      ctx.clearRect(0, 0, cW, cH);

      /* ── CONVERGE ── */
      if (phase === 'converge') {
        if (!convergeStart) convergeStart = ts;
        const prog = Math.min((ts - convergeStart) / CONVERGE_DUR, 1);
        const e    = easeOut(prog);

        particles.forEach(p => {
          const mt = 1 - e;
          p.cx = mt*mt*p.sx + 2*mt*e*p.cpX + e*e*p.tx;
          p.cy = mt*mt*p.sy + 2*mt*e*p.cpY + e*e*p.ty;
          ctx.beginPath();
          ctx.arc(p.cx, p.cy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.2 + e * 0.8})`;
          ctx.fill();
        });

        if (prog >= 1) {
          phase = 'wander';
          wanderStart = ts;
        }

      /* ── WANDER (loop) ── */
      } else if (phase === 'wander') {
        if (!wanderStart) wanderStart = ts;
        const t = (ts - wanderStart) / 1000; /* seconds */

        /* 2.5초 후 "CLICK" 힌트 표시 */
        if (!hintShown && t > 2.5 && enterPrompt) {
          hintShown = true;
          enterPrompt.textContent = 'CLICK';
          enterPrompt.classList.add('visible');
        }

        particles.forEach(p => {
          p.cx = p.tx + p.ax * Math.sin(p.wx * t + p.phx);
          p.cy = p.ty + p.ay * Math.sin(p.wy * t + p.phy);
          ctx.beginPath();
          ctx.arc(p.cx, p.cy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.88)';
          ctx.fill();
        });

      /* ── SETTLE ── */
      } else if (phase === 'settle') {
        if (!settleStart) settleStart = ts;
        const prog = Math.min((ts - settleStart) / SETTLE_DUR, 1);
        const e    = easeInOut(prog);

        particles.forEach(p => {
          p.cx = p.snapX + (p.tx - p.snapX) * e;
          p.cy = p.snapY + (p.ty - p.snapY) * e;
          ctx.beginPath();
          ctx.arc(p.cx, p.cy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.88 + e * 0.12})`;
          ctx.fill();
        });

        if (prog >= 1) {
          phase = 'dissolve';
          dissolveStart = ts;
        }

      /* ── DISSOLVE ── */
      } else if (phase === 'dissolve') {
        if (!dissolveStart) dissolveStart = ts;
        const t = Math.min((ts - dissolveStart) / DISSOLVE_DUR, 1);
        const e = smoothstep(t);

        particles.forEach(p => {
          const sz = p.size * (1 - e);
          if (sz < 0.15) return;
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${(1 - e) * 0.95})`;
          ctx.fill();
        });

        if (logoEl) {
          const lt = Math.max(0, (t - 0.3) / 0.7);
          logoEl.style.opacity = String(smoothstep(lt));
        }

        if (t >= 1) {
          canvas.style.opacity = '0';
          if (logoEl) logoEl.style.opacity = '1';

          /* "CLICK TO ENTER" 힌트 리셋 후 표시 */
          if (enterPrompt) {
            enterPrompt.classList.remove('visible');
            enterPrompt.textContent = 'CLICK TO ENTER';
            setTimeout(() => enterPrompt.classList.add('visible'), 80);
          }
          loader.classList.add('ready');

          /* ---- 두 번째 클릭: 메인 페이지 진입 ---- */
          let entered = false;
          function enterSite(ev) {
            if (entered) return;
            entered = true;
            if (ev.type === 'touchend') ev.preventDefault();
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            triggerHero();
          }
          loader.addEventListener('click',    enterSite);
          loader.addEventListener('touchend', enterSite, { passive: false });
          return; /* RAF 종료 */
        }
      }

      requestAnimationFrame(frame);
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
