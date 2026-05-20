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

  // Main image (thumbnail only)
  const $mainImg = document.getElementById('pdMainImg');
  if ($mainImg && project.thumbnail) {
    const img = document.createElement('img');
    img.src = project.thumbnail;
    img.alt = project.name;
    $mainImg.appendChild(img);
  }

  // Extra images (below body text)
  const $extraImgs = document.getElementById('pdExtraImgs');
  if ($extraImgs && Array.isArray(project.images) && project.images.length) {
    project.images.forEach(src => {
      const div = document.createElement('div');
      div.className = 'pd-extra-img';
      const img = document.createElement('img');
      img.src = src;
      img.alt = project.name;
      img.loading = 'lazy';
      div.appendChild(img);
      $extraImgs.appendChild(div);
    });
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
