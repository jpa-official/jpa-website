const PROJECTS = window.PROJECTS || [];
let currentFilter = 'all';
let currentView = window.innerWidth <= 768 ? 'gallery' : 'gallery';

const $list = document.getElementById('pjList');
const $filter = document.getElementById('projFilter');
const $viewToggle = document.getElementById('viewToggle');

function buildCard(project) {
  const a = document.createElement('a');
  a.className = 'pj-item';
  a.href = `project.html?id=${encodeURIComponent(project.id)}`;
  a.dataset.category = project.category;

  const imgHtml = project.thumbnail
    ? `<img src="${project.thumbnail}" alt="${project.name}" loading="lazy">`
    : `<div class="pj-item-img-placeholder"></div>`;

  a.innerHTML = `
    <div class="pj-item-img">${imgHtml}</div>
    <div class="pj-item-info">
      <div class="pj-item-left">
        <h2 class="pj-item-name">${project.name}</h2>
        <p class="pj-item-desc">${project.desc}</p>
      </div>
      <span class="pj-item-cat">${project.category.toUpperCase()}</span>
    </div>`;

  return a;
}

function buildRow(project, index) {
  const a = document.createElement('a');
  a.className = 'pj-row';
  a.href = `project.html?id=${encodeURIComponent(project.id)}`;
  a.dataset.category = project.category;

  const num = String(index + 1).padStart(2, '0');
  a.innerHTML = `
    <span class="pj-row-num">${num}</span>
    <span class="pj-row-name">
      <span class="pj-row-en">${project.name}</span>
      ${project.nameKo ? `<span class="pj-row-ko">${project.nameKo}</span>` : ''}
    </span>
    <span class="pj-row-cat">${project.category.toUpperCase()}</span>
    <span class="pj-row-year">${project.year || ''}</span>
    <span class="pj-row-loc">${project.location || ''}</span>`;

  return a;
}

function render(filter) {
  $list.innerHTML = '';

  const list = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  if (list.length === 0) {
    $list.innerHTML = '<p class="pj-empty">NO PROJECTS IN THIS CATEGORY</p>';
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach((p, i) => {
    const el = currentView === 'list' ? buildRow(p, i) : buildCard(p);
    frag.appendChild(el);
  });
  $list.appendChild(frag);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  $list.querySelectorAll('.pj-item, .pj-row').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 6) * 0.05}s`;
    io.observe(el);
  });
}

$filter.addEventListener('click', (e) => {
  const btn = e.target.closest('.pj-filter-btn');
  if (!btn || btn.dataset.filter === currentFilter) return;
  currentFilter = btn.dataset.filter;
  $filter.querySelectorAll('.pj-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render(currentFilter);
});

$viewToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) return;
  const btn = e.target.closest('.pj-view-btn');
  if (!btn || btn.dataset.view === currentView) return;
  currentView = btn.dataset.view;
  $viewToggle.querySelectorAll('.pj-view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render(currentFilter);
});

render('all');
