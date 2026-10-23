/* ============================================
   PROJECT DETAIL — renderer (full-bleed hero + stacked gallery)
   ============================================ */

(function () {
  const PROJECTS = window.PROJECTS || [];
  const id = new URLSearchParams(window.location.search).get('id');
  const project = PROJECTS.find(p => p.id === id);
  if (!project) { window.location.href = 'projects.html'; return; }

  document.title = `${project.name} — JUNGLIM PLANNING ADVISORY ©2026`;

  setText('pdTitle', project.name.toUpperCase());
  setText('pdNameKo', project.nameKo || '');
  setText('pdMetaLocation', project.location || '—');
  setText('pdMetaYear', project.year || '—');
  setText('pdMetaCategory', (project.category || '—').toUpperCase());
  setText('pdMetaScope', Array.isArray(project.scope) ? project.scope.join('  ·  ') : (project.scope || '—'));

  // Hero = thumbnail, gallery = the rest
  const hero = document.getElementById('psHeroMedia');
  if (hero && project.thumbnail) hero.appendChild(createMedia(project.thumbnail, project.name));

  buildSlider(document.getElementById('psGallery'), project.images || []);

  fill('pdBodyKo', project.body);
  fill('pdBodyEn', project.bodyEn);

  const idx = PROJECTS.findIndex(p => p.id === id);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  link('pdPrev', 'pdPrevName', prev);
  link('pdNext', 'pdNextName', next);

  // Keep the hero title on one line: shrink it only when a long name would overflow
  const title = document.getElementById('pdTitle');
  function fitTitle() {
    title.style.fontSize = '';
    const box = title.parentElement.clientWidth;
    const w = title.scrollWidth;
    if (w > box) title.style.fontSize = (parseFloat(getComputedStyle(title).fontSize) * box / w * 0.98) + 'px';
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitTitle);
  window.addEventListener('resize', fitTitle);

  requestAnimationFrame(() => document.getElementById('pdHero').classList.add('in-view'));

  // Sub images: same arrow slider as the live detail page (infinite loop)
  function buildSlider(box, list) {
    if (!box || !list.length) { if (box) box.remove(); return; }
    if (list.length === 1) { box.appendChild(createMedia(list[0], project.name)); return; }
    box.classList.add('pd-slider');
    if (project.subCrop) box.classList.add('pd-crop169');   // 가로로 긴 서브 이미지를 다른 프로젝트와 같은 16:9 프레임으로
    const track = document.createElement('div');
    track.className = 'pd-slider-track';
    list.forEach((src, i) => {
      const s = document.createElement('div');
      s.className = 'pd-slide' + (i === 0 ? ' active' : '');
      s.appendChild(createMedia(src, project.name));
      track.appendChild(s);
    });
    box.appendChild(track);

    const total = list.length;
    const slides = track.querySelectorAll('.pd-slide');
    const head = slides[total - 1].cloneNode(true), tail = slides[0].cloneNode(true);
    head.classList.remove('active'); tail.classList.remove('active');
    track.insertBefore(head, slides[0]); track.appendChild(tail);

    const arrow = d => `<svg viewBox="0 0 24 24" fill="none"><path d="${d}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pd-slider-btn pd-slider-prev'; prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = arrow('M19 12H5M5 12L11 6M5 12L11 18');
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pd-slider-btn pd-slider-next'; nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = arrow('M5 12H19M19 12L13 6M19 12L13 18');
    if (isMobile) { prevBtn.style.display = 'none'; nextBtn.style.display = 'none'; }
    const counter = document.createElement('div');
    counter.className = 'pd-slider-counter';
    counter.textContent = `1 / ${total}`;

    let pos = 1, animating = false, timer;
    const setPos = (p, anim) => { track.style.transition = anim ? '' : 'none'; track.style.transform = `translateX(-${p * 100}%)`; };
    setPos(pos, false);
    function goTo(p) {
      if (animating) return;
      animating = true;
      slides[(pos - 1 + total) % total].classList.remove('active');
      pos = p;
      const real = (pos - 1 + total) % total;
      slides[real].classList.add('active');
      motion(slides[real]);
      counter.textContent = `${real + 1} / ${total}`;
      setPos(pos, true);
      clearTimeout(timer); timer = setTimeout(settle, 400);
    }
    function settle() {
      clearTimeout(timer);
      if (!animating) return;
      if (pos === 0) { pos = total; setPos(pos, false); }
      else if (pos === total + 1) { pos = 1; setPos(pos, false); }
      track.offsetHeight;
      track.style.transition = '';
      animating = false;
    }
    track.addEventListener('transitionend', e => { if (e.target === track) settle(); });
    prevBtn.addEventListener('click', () => goTo(pos - 1));
    nextBtn.addEventListener('click', () => goTo(pos + 1));
    let x0 = 0;
    box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => { goTo(x0 - e.changedTouches[0].clientX <= -40 ? pos - 1 : pos + 1); }, { passive: true });
    box.append(prevBtn, nextBtn, counter);

    // 첫 장이 모션 다이어그램이면 슬라이더가 화면에 들어올 때 재생
    new IntersectionObserver(es => es.forEach(e => {
      const was = box.classList.contains('in-view');
      box.classList.toggle('in-view', e.isIntersecting);
      if (e.isIntersecting && !was) motion(slides[(pos - 1 + total) % total]);
    }), { threshold: 0.4 }).observe(box);
  }

  // 모션 다이어그램(iframe): 보이는 장은 처음부터 재생, 나머지는 완성된 모습으로
  function motion(active) {
    const onScreen = active.closest('.in-view');
    document.querySelectorAll('.pd-embed').forEach(f => {
      const d = f.contentWindow && f.contentWindow.diagram;
      if (d) f.closest('.pd-slide') === active && onScreen ? d.play() : d.rest();
    });
  }

  function fill(elId, list) {
    const el = document.getElementById(elId);
    if (!el || !Array.isArray(list)) return;
    list.forEach(t => { const p = document.createElement('p'); p.textContent = t; el.appendChild(p); });
  }
  function link(aId, nameId, p) {
    const a = document.getElementById(aId);
    if (a && p) { a.href = `project.html?id=${encodeURIComponent(p.id)}`; setText(nameId, p.name); }
  }
  function setText(elId, v) { const el = document.getElementById(elId); if (el) el.textContent = v; }
  function createMedia(src, alt) {
    const embed = project.motion && project.motion[src.split('?')[0]];
    if (embed && window.matchMedia('(min-width: 769px)').matches) {
      const f = document.createElement('iframe');
      Object.assign(f, { src: embed, className: 'pd-embed', title: alt, tabIndex: -1 });
      f.setAttribute('aria-hidden', 'true');
      return f;
    }
    if (/\.mp4/i.test(src)) {
      const v = document.createElement('video');
      Object.assign(v, { src, autoplay: true, loop: true, muted: true, playsInline: true });
      v.setAttribute('aria-label', alt);
      return v;
    }
    const img = document.createElement('img');
    img.src = src; img.alt = alt;
    return img;
  }
})();
