/* ============================================
   JUNGLIM PLANNING ADVISORY ©2026
   Motion & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader          = document.getElementById('loader');
  const introStatement  = document.getElementById('loaderStatement');

  if (loader && document.documentElement.classList.contains('skip-intro')) {
    /* index.html#contact (CONTACT 메뉴) — 인트로 없이 바로 CONTACT 섹션으로 */
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    triggerHero();
    requestAnimationFrame(() => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView();
    });
  } else if (loader && introStatement) {
    /* 문장 인트로 (index.html) — 단어별로 나타나고, 클릭하면 사라지며 메인 페이지 진입 */
    let n = 0;
    introStatement.querySelectorAll('.line').forEach(line => {
      line.innerHTML = line.innerHTML.split(/<br class="m">/).map(part =>
        part.trim().split(/\s+/).map(w => `<span class="w" style="--i:${n++}">${w}</span>`).join(' ')
      ).join('<br class="m"> ') + ' ';
    });
    document.documentElement.classList.add('intro-open');
    const show = () => requestAnimationFrame(() => loader.classList.add('in'));
    document.fonts ? document.fonts.ready.then(show) : show();

    const leave = () => {
      if (loader.classList.contains('out')) return;
      loader.classList.add('out');
      document.documentElement.classList.remove('intro-open');
      document.body.classList.add('loaded');
      setTimeout(triggerHero, 500);
      setTimeout(() => loader.classList.add('hidden'), 1500);
    };
    loader.addEventListener('click', leave);
    document.addEventListener('keydown', e => {
      if (!loader.classList.contains('out') && ['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); leave(); }
    });
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

  /* ---------- HEADER COLOR (헤더 뒤 배경 밝기에 따라 글자색 전환) ---------- */
  (function headerTone() {
    if (!header) return;
    const isDark = el => {
      if (/^(IMG|VIDEO|CANVAS)$/.test(el.tagName)) return true;
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (!m || (m[3] !== undefined && +m[3] === 0)) return null;     // 투명 → 아래 요소 확인
      return (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000 < 128;
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = header.getBoundingClientRect().top + header.offsetHeight / 2;
      let dark = false;
      for (const el of document.elementsFromPoint(60, Math.max(y, 1))) {
        if (header.contains(el)) continue;
        const d = isDark(el);
        if (d !== null) { dark = d; break; }
      }
      header.classList.toggle('on-dark', dark);
    };
    const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    setInterval(schedule, 500);   // 로더 종료·아코디언 등 스크롤 없는 변화 대응
    update();
  })();

  /* ---------- HERO REVEAL ---------- */
  function triggerHero() {
    document.querySelector('.hero').classList.add('in-view');
  }

  /* ---------- PARALLAX FOR HERO TITLE ---------- */
  const heroTitle = document.querySelector('.hero-title');
  const heroEl    = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (!heroTitle || !heroEl) return;
    const y = window.scrollY - heroEl.offsetTop;
    if (y > 0 && y < window.innerHeight) {
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

  /* ---------- PROJECT SEARCH (헤더 우측 SEARCH) ---------- */
  (function projectSearch() {
    const btn = document.getElementById('searchBtn');
    if (!btn) return;

    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Search projects');
    overlay.innerHTML = `
      <div class="so-top"><button type="button" class="so-close">CLOSE</button></div>
      <input class="so-input" type="text" enterkeyhint="search" placeholder="SEARCH PROJECTS" autocomplete="off" spellcheck="false" />
      <p class="so-count"></p>
      <div class="so-results"></div>`;
    document.body.appendChild(overlay);

    const input   = overlay.querySelector('.so-input');
    const count   = overlay.querySelector('.so-count');
    const results = overlay.querySelector('.so-results');

    // 프로젝트 데이터가 없는 페이지에서는 처음 열 때 불러옴
    let ready = null;
    const loadData = () => ready || (ready = window.PROJECTS ? Promise.resolve() : new Promise(resolve => {
      const sc = document.createElement('script');
      sc.src = 'js/projects-data.js?v=20261020e';
      sc.onload = sc.onerror = resolve;
      document.head.appendChild(sc);
    }));

    const haystack = p => [p.name, p.nameKo, p.desc, p.category, p.location, p.client, p.year, ...(p.scope || [])]
      .filter(Boolean).join(' ').toLowerCase();

    function render() {
      const list  = window.PROJECTS || [];
      const terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const hits  = list.filter(p => { const h = haystack(p); return terms.every(t => h.includes(t)); });

      results.innerHTML = '';
      count.textContent = terms.length ? `${hits.length} RESULTS` : '';   // 입력 전에는 검색창만
      if (!terms.length) return;
      hits.forEach(p => {
        const a = document.createElement('a');
        a.className = 'so-item';
        a.href = `project.html?id=${encodeURIComponent(p.id)}`;
        const box = document.createElement('div');
        box.className = 'so-item-img';
        if (p.thumbnail) {
          const img = document.createElement('img');
          img.src = p.thumbnail; img.alt = p.name; img.loading = 'lazy';
          box.appendChild(img);
        }
        const name = document.createElement('div');
        name.className = 'so-item-name';
        name.textContent = p.name;
        const meta = document.createElement('div');
        meta.className = 'so-item-meta';
        meta.textContent = p.nameKo || p.category;   // 한글명이 있으면 카테고리는 생략
        a.append(box, name, meta);
        results.appendChild(a);
      });
    }

    function open() {
      overlay.classList.add('open');
      document.body.classList.add('search-open');
      input.focus();
      loadData().then(render);
    }
    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('search-open');
    }

    btn.addEventListener('click', open);
    overlay.querySelector('.so-close').addEventListener('click', close);
    input.addEventListener('input', render);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const first = results.querySelector('.so-item'); if (first) location.href = first.href; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
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
