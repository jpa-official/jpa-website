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
        slide.appendChild(createMedia(src, project.name));
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

      // 회전문(무한 루프): 양 끝에 복제 슬라이드를 두고, 복제본 도착 시 실제 슬라이드로 순간 이동
      const total = allImages.length;
      const slides = track.querySelectorAll('.pd-slide');
      const headClone = slides[total - 1].cloneNode(true);
      const tailClone = slides[0].cloneNode(true);
      headClone.classList.remove('active');
      tailClone.classList.remove('active');
      track.insertBefore(headClone, slides[0]);
      track.appendChild(tailClone);

      let pos = 1;            // track 내 위치 (0 = 앞 복제, total + 1 = 뒤 복제)
      let animating = false;

      function setPos(p, animate) {
        track.style.transition = animate ? '' : 'none';
        track.style.transform = `translateX(-${p * 100}%)`;
      }
      setPos(pos, false);

      function goTo(p) {
        if (animating) return;
        animating = true;
        slides[(pos - 1 + total) % total].classList.remove('active');
        pos = p;
        const real = (pos - 1 + total) % total;
        slides[real].classList.add('active');
        counter.textContent = `${real + 1} / ${total}`;
        setPos(pos, true);
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 400); // transitionend 누락 대비
      }

      let settleTimer;
      function settle() {
        clearTimeout(settleTimer);
        if (!animating) return;
        if (pos === 0) { pos = total; setPos(pos, false); }
        else if (pos === total + 1) { pos = 1; setPos(pos, false); }
        track.offsetHeight; // 순간 이동 반영 후 transition 복구
        track.style.transition = '';
        animating = false;
      }
      track.addEventListener('transitionend', e => { if (e.target === track) settle(); });

      btnPrev.addEventListener('click', () => goTo(pos - 1));
      btnNext.addEventListener('click', () => goTo(pos + 1));

      let touchStartX = 0;
      $mainImg.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      $mainImg.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff <= -40) {
          goTo(pos - 1);
        } else {
          goTo(pos + 1);
        }
      }, { passive: true });

      $mainImg.appendChild(btnPrev);
      $mainImg.appendChild(btnNext);
      $mainImg.appendChild(counter);

    } else if (allImages.length === 1) {
      $mainImg.appendChild(createMedia(allImages[0], project.name));
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

  function createMedia(src, alt) {
    if (/\.mp4$/i.test(src)) {
      const video = document.createElement('video');
      video.src = src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-label', alt);
      return video;
    }
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'eager';
    return img;
  }
})();
