/* ============================================
   ABOUT PAGE — Specific Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NUMBER COUNTER ANIMATION ---------- */
  const numberValues = document.querySelectorAll('.num-value');

  function animateNumber(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateNumber(entry.target);
      }
    });
  }, { threshold: 0.4 });

  numberValues.forEach(el => numberObserver.observe(el));

});
