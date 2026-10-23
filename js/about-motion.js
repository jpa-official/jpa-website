/* ============================================
   ABOUT — scroll motion
   lines rise in, keywords/paragraphs stagger, timeline draws,
   hero title drifts on scroll. Respects prefers-reduced-motion.
   ============================================ */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('m-ready');

  // split titles into rising lines
  document.querySelectorAll('.intro-title').forEach(el => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean);
    el.innerHTML = parts.map((p, i) => `<span class="m-line"><span class="m-line-in" style="--i:${i}">${p}</span></span>`).join('');
  });
  // split keyword row into staggered words
  document.querySelectorAll('.dts-keywords').forEach(el => {
    el.innerHTML = el.textContent.split('·').map((w, i) => `<span class="m-word" style="--i:${i}">${w.trim()}</span>`).join('<span class="m-dot">·</span>');
  });
  // stagger index for groups
  const groups = ['.intro-body p', '.process-intro p', '.cic-body p', '.num-block'];
  groups.forEach(sel => document.querySelectorAll(sel).forEach((el, i, all) => {
    const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--i', idx);
    el.classList.add('m-item');
  }));
  document.querySelectorAll('.section-label, .cta-link').forEach(el => el.classList.add('m-item'));

  // 6 steps: appear one by one in order (01 → 06) as they scroll into view
  const steps = Array.prototype.slice.call(document.querySelectorAll('.stp'));

  // 6단계 모션은 '동작 줄이기' 설정과 상관없이 항상 재생 (observer 미지원 브라우저만 즉시 표시)
  if (steps.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    let next = 0, busy = false;
    const GAP = 650;                              // 단계 사이 간격(ms)
    const run = () => {
      if (busy) return;
      if (next < steps.length && seen.has(steps[next])) {
        steps[next].classList.add('stp-in');
        next++; busy = true;
        setTimeout(() => { busy = false; run(); }, GAP);
      }
    };
    const sio = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting || e.boundingClientRect.top < 0) { seen.add(e.target); sio.unobserve(e.target); } });
      run();
    }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
    steps.forEach(el => sio.observe(el));
  }

  const targets = document.querySelectorAll('.m-item, .intro-title, .dts-keywords');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('m-in'));
    if (!('IntersectionObserver' in window)) steps.forEach(el => el.classList.add('stp-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('m-in'); io.unobserve(e.target); } });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => io.observe(el));

  // hero: title drifts up and fades as you scroll away
  const hero = document.querySelector('.about-hero-inner');
  if (hero) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        hero.style.transform = `translateY(${-y * 0.18}px)`;
        hero.style.opacity = String(1 - y / window.innerHeight * 0.9);
        ticking = false;
      });
    }, { passive: true });
  }
})();
