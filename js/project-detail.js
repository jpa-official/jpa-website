/* ============================================
   PROJECT DETAIL — URL param renderer
   ============================================ */

(function () {
  const PROJECTS = window.PROJECTS || [];

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const $main = document.getElementById('pdMain');
  const $notFound = document.getElementById('pdNotFound');
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    window.location.href = 'projects.html';
    return;
  }

  // Document title
  document.title = `${project.name} — JUNGLIM PLANNING ADVISORY ©2026`;

  // Hero
  setText('pdTitle', project.name.toUpperCase());
  setText('pdNameKo', project.nameKo || '');

  // Meta row
  setText('pdMetaLocation', project.location || '—');
  setText('pdMetaYear', project.year || '—');
  setText('pdMetaCategory', (project.category || '—').toUpperCase());

  const scopeVal = Array.isArray(project.scope)
    ? project.scope.join('  ·  ')
    : (project.scope || '—');
  setText('pdMetaScope', scopeVal);

  // Main image + slider
  const $mainImg = document.getElementById('pdMainImg');
  if ($mainImg) {
    const allImages = [];
    if (project.thumbnail) allImages.push(project.thumbnail);
    if (Array.isArray(project.images)) allImages.push(...project.images);

    if (allImages.length > 1) {
      $mainImg.classList.add('pd-slider');

      const track = document.createElement('div');
      track.className = 'pd-slider-track';
      allImages.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'pd-slide' + (i === 0 ? ' active pd-slide-main' : '');
        const img = document.createElement('img');
        img.src = src;
        img.alt = project.name;
        img.loading = i === 0 ? 'eager' : 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);
      });
      $mainImg.appendChild(track);

      const isMobile = window.matchMedia('(max-width: 900px)').matches;

      const btnPrev = document.createElement('button');
      btnPrev.className = 'pd-slider-btn pd-slider-prev';
      btnPrev.setAttribute('aria-label', 'Previous image');
      btnPrev.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      if (isMobile) btnPrev.style.display = 'none';

      const btnNext = document.createElement('button');
      btnNext.className = 'pd-slider-btn pd-slider-next';
      btnNext.setAttribute('aria-label', 'Next image');
      btnNext.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      if (isMobile) btnNext.style.display = 'none';

      const counter = document.createElement('div');
      counter.className = 'pd-slider-counter';
      counter.textContent = `1 / ${allImages.length}`;

      let current = 0;
      const slides = track.querySelectorAll('.pd-slide');

      function goTo(n) {
        slides[current].classList.remove('active');
        current = (n + allImages.length) % allImages.length;
        slides[current].classList.add('active');
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent = `${current + 1} / ${allImages.length}`;
      }

      btnPrev.addEventListener('click', () => goTo(current - 1));
      btnNext.addEventListener('click', () => goTo(current + 1));

      let touchStartX = 0;
      track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 10) {
          goTo(current + 1);
        } else if (Math.abs(diff) >= 40) {
          goTo(diff > 0 ? current + 1 : current - 1);
        }
      }, { passive: true });

      $mainImg.appendChild(btnPrev);
      $mainImg.appendChild(btnNext);
      $mainImg.appendChild(counter);

    } else if (allImages.length === 1) {
      const img = document.createElement('img');
      img.src = allImages[0];
      img.alt = project.name;
      $mainImg.appendChild(img);
    }
  }

  // Body — Korean
  const $bodyKo = document.getElementById('pdBodyKo');
  if ($bodyKo && Array.isArray(project.body)) {
    project.body.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      $bodyKo.appendChild(p);
    });
  }

  // Body — English (optional field)
  const $bodyEn = document.getElementById('pdBodyEn');
  if ($bodyEn && Array.isArray(project.bodyEn) && project.bodyEn.length) {
    project.bodyEn.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      $bodyEn.appendChild(p);
    });
  }

  // Prev / Next
  const idx = PROJECTS.findIndex(p => p.id === id);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  const $prev = document.getElementById('pdPrev');
  const $next = document.getElementById('pdNext');
  if ($prev && prev) {
    $prev.href = `project.html?id=${encodeURIComponent(prev.id)}`;
    setText('pdPrevName', prev.name);
  }
  if ($next && next) {
    $next.href = `project.html?id=${encodeURIComponent(next.id)}`;
    setText('pdNextName', next.name);
  }

  // Hero reveal
  requestAnimationFrame(() => {
    const hero = document.getElementById('pdHero');
    if (hero) hero.classList.add('in-view');
  });

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
})();
