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
  const groups = ['.intro-body p', '.process-intro p', '.cic-body p', '.stp', '.num-block'];
  groups.forEach(sel => document.querySelectorAll(sel).forEach((el, i, all) => {
    const idx = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--i', idx);
    el.classList.add('m-item');
  }));
  document.querySelectorAll('.section-label, .cta-link').forEach(el => el.classList.add('m-item'));

  const targets = document.querySelectorAll('.m-item, .intro-title, .dts-keywords');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('m-in'));
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
