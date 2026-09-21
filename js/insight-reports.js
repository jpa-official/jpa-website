/* ============================================
   INSIGHT REPORTS LISTING PAGE
   ============================================ */

(function () {
  const REPORTS = window.INSIGHT_REPORTS || [];
  let currentFilter = 'all';

  const $list = document.getElementById('irList');
  const $filter = document.getElementById('irFilter');

  if (!$list) return;

  function buildItem(report, index) {
    const a = document.createElement('a');
    a.className = 'ir-item';
    a.href = `insight-report.html?id=${encodeURIComponent(report.id)}`;
    a.dataset.category = report.category;

    const num = String(index + 1).padStart(2, '0');

    a.innerHTML = `
      <div class="ir-item-bg"></div>
      <div class="ir-item-inner">
        <span class="ir-item-num">${num}</span>
        <div class="ir-item-body">
          <span class="ir-item-cat">${report.category.toUpperCase()}</span>
          <h2 class="ir-item-title">${report.title}</h2>
          <p class="ir-item-summary">${report.summary}</p>
        </div>
        <div class="ir-item-meta">
          <span class="ir-item-date">${report.date}</span>
          <span class="ir-item-cta">
            READ REPORT
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
      </div>`;

    return a;
  }

  function render(filter) {
    $list.innerHTML = '';

    const list = filter === 'all'
      ? REPORTS
      : REPORTS.filter(r => r.category === filter);

    if (list.length === 0) {
      $list.innerHTML = '<p class="ir-empty">NO REPORTS IN THIS CATEGORY</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach((r, i) => frag.appendChild(buildItem(r, i)));
    $list.appendChild(frag);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    $list.querySelectorAll('.ir-item').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 5) * 0.07}s`;
      io.observe(el);
    });
  }

  if ($filter) {
    $filter.addEventListener('click', (e) => {
      const btn = e.target.closest('.ir-filter-btn');
      if (!btn || btn.dataset.filter === currentFilter) return;
      currentFilter = btn.dataset.filter;
      $filter.querySelectorAll('.ir-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(currentFilter);
    });
  }

  render('all');
})();
