/* ============================================
   INSIGHT REPORT DETAIL PAGE
   ============================================ */

(function () {
  const REPORTS = window.INSIGHT_REPORTS || [];
  const $main = document.getElementById('irdMain');
  const $progress = document.getElementById('irdProgress');

  if (!$main) return;

  /* --- Parse report ID from URL --- */
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get('id');
  const report = REPORTS.find(r => r.id === reportId);

  if (!report) {
    $main.innerHTML = `
      <div class="ird-not-found">
        <h2>REPORT NOT FOUND</h2>
        <p>요청하신 리포트를 찾을 수 없습니다.</p>
        <a href="insight-reports.html">← ALL INSIGHTS</a>
      </div>`;
    return;
  }

  /* --- Update page title --- */
  document.title = `${report.titleEn} — JUNGLIM PLANNING ADVISORY ©2026`;

  /* --- Build cover --- */
  function buildCover() {
    return `
      <section class="ird-cover">
        <a href="insight-reports.html" class="ird-back">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ALL INSIGHTS
        </a>
        <div class="ird-cover-inner">
          <span class="ird-cover-cat">${report.category.toUpperCase()} — ${report.dateKo}</span>
          <h1 class="ird-cover-title">${report.title}</h1>
          <div class="ird-cover-meta">
            <div class="ird-meta-item">
              <span class="ird-meta-label">PUBLISHED</span>
              <span class="ird-meta-value">${report.date}</span>
            </div>
            <div class="ird-meta-item">
              <span class="ird-meta-label">CATEGORY</span>
              <span class="ird-meta-value">${report.categoryKo}</span>
            </div>
            <div class="ird-meta-item">
              <span class="ird-meta-label">BY</span>
              <span class="ird-meta-value">JPA Research</span>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* --- Build a single section --- */
  function buildSection(sec, index) {
    if (sec.type === 'summary') {
      let html = `<div class="ird-summary-wrap"><div class="ird-body"><div class="ird-section ird-section-summary">`;
      html += `<h2 class="ird-section-title">${sec.title}</h2>`;
      sec.body.forEach(p => { html += `<p class="ird-text">${p}</p>`; });
      html += `</div></div></div>`;
      return html;
    }

    if (sec.type === 'conclusion') {
      let html = `<div class="ird-body"><div class="ird-section ird-section-conclusion">`;
      html += `<h2 class="ird-section-title">${sec.title}</h2>`;
      html += `<ol class="ird-takeaways">`;
      sec.items.forEach((item, i) => {
        html += `<li class="ird-takeaway"><span class="ird-takeaway-num">${String(i + 1).padStart(2, '0')}</span><span>${item}</span></li>`;
      });
      html += `</ol></div></div>`;
      return html;
    }

    /* Default: type === 'section' */
    let html = `<div class="ird-body"><div class="ird-section">`;
    html += `<h2 class="ird-section-title">${sec.title}</h2>`;
    if (sec.subtitle) html += `<span class="ird-section-subtitle">${sec.subtitle}</span>`;

    if (sec.highlight) {
      html += `<div class="ird-highlight">
        <span class="ird-highlight-stat">${sec.highlight.stat}</span>
        <span class="ird-highlight-label">${sec.highlight.label}</span>
      </div>`;
    }

    sec.body.forEach(p => { html += `<p class="ird-text">${p}</p>`; });

    if (sec.pullQuote) {
      html += `<blockquote class="ird-pullquote">${sec.pullQuote}</blockquote>`;
    }

    html += `</div></div>`;
    return html;
  }

  /* --- Build PDF CTA --- */
  function buildCta() {
    return `
      <div class="ird-cta">
        <div class="ird-cta-inner" id="irdCtaInner">
          <span class="ird-cta-label">FULL REPORT</span>
          <h2 class="ird-cta-title">DOWNLOAD<br>THE PDF</h2>
          <p class="ird-cta-desc">리포트 전문과 데이터 분석 자료를 PDF로<br>다운로드하세요.</p>
          <a href="${report.pdfUrl}" class="ird-pdf-btn" download>
            <span>DOWNLOAD PDF</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 3v13M12 16l-4-4M12 16l4-4M3 19h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <p class="ird-cta-note">PDF · 무료 다운로드</p>
        </div>
        <a href="insight-reports.html" class="ird-more">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ALL INSIGHTS
          <span></span>
        </a>
      </div>`;
  }

  /* --- Assemble page --- */
  let html = buildCover();
  report.sections.forEach((sec, i) => { html += buildSection(sec, i); });
  html += buildCta();
  $main.innerHTML = html;

  /* --- Intersection Observer for section reveals --- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $main.querySelectorAll('.ird-section, #irdCtaInner').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.04}s`;
    io.observe(el);
  });

  /* --- Reading progress bar --- */
  if ($progress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      $progress.style.width = `${Math.min(pct, 100)}%`;
    }, { passive: true });
  }
})();
