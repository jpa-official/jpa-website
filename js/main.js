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

  /* ---------- HERO REVEAL ---------- */
  function triggerHero() {
    document.querySelector('.hero').classList.add('in-view');
  }

  /* ---------- PARALLAX FOR HERO TITLE ---------- */
  const heroTitle = document.querySelector('.hero-title');
  const heroEl    = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (!heroTitle || !heroEl) return;
    const y = window.scrollY - heroEl.offsetTop;   // 메인에서는 슬라이드 아래에 위치
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

  /* ---------- HOME SLIDES (프로젝트 대표 이미지, 1초 간격) ---------- */
  (function homeSlides() {
    const track = document.getElementById('homeSlides');
    if (!track || !window.PROJECTS) return;

    const imgs = window.PROJECTS.filter(p => p.thumbnail).map((p, i) => {
      const img = document.createElement('img');
      img.alt = p.name;
      img.dataset.src = p.thumbnail;
      if (i === 0) img.className = 'active';
      track.appendChild(img);
      return img;
    });
    if (!imgs.length) return;

    // 다음 몇 장만 미리 불러와 한꺼번에 받지 않도록
    const load = i => { const img = imgs[i % imgs.length]; if (!img.src) img.src = img.dataset.src; };
    let cur = 0;
    [0, 1, 2].forEach(load);

    setInterval(() => {
      const next = (cur + 1) % imgs.length;
      load(next + 2);
      if (!imgs[next].complete || !imgs[next].naturalWidth) { load(next); return; }  // 아직 로딩 중이면 현재 장 유지
      imgs[cur].classList.remove('active');
      imgs[next].classList.add('active');
      cur = next;
    }, 1000);

    // 슬라이드 위에서는 헤더 로고 숨김 (가운데 로고와 중복 방지)
    const section = track.closest('.home-slides');
    const toggle = () => document.body.classList.toggle('on-slides', window.scrollY < section.offsetHeight - 80);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  })();

  /* ---------- INTERSECTION OBSERVER (카드 생성 후 등록) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .pj-item, .hero, .contact, .site-footer').forEach(el => io.observe(el));

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
