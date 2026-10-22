/* eslint-disable */
// @ts-nocheck
/**
 * Original page behaviour, carried over unchanged from the published single-document
 * build so that this page renders and behaves exactly as it does there.
 *
 * Do not rewrite these in idiomatic React. They are here precisely because rewriting
 * them is what caused this page to drift from the published design. The only
 * modifications permitted are the submit handlers, which post to the API routes.
 */

var savedProperties = [];

function switchSource(src, btn) {
  document.querySelectorAll('.src-tab').forEach(t => t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  var cards = document.querySelectorAll('.opp-card');
  var visible = 0;
  cards.forEach(function(c) {
    var match = src === 'all' || c.dataset.source === src;
    c.style.display = match ? 'flex' : 'none';
    if(match) visible++;
  });
  updateCount(visible);
  document.getElementById('opp-no-results').style.display = visible === 0 ? 'block' : 'none';
}

function oppTypeFilter(type, btn) {
  document.querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  var cards = document.querySelectorAll('.opp-card');
  var visible = 0;
  cards.forEach(function(c) {
    var show = false;
    if(type === 'all') show = true;
    else if(type === 'residential') show = c.dataset.type === 'residential';
    else if(type === 'commercial') show = c.dataset.type === 'commercial';
    else if(type === 'land') show = c.dataset.type === 'land';
    else if(type === 'affordable') show = c.dataset.affordable === 'true';
    else if(type === 'offplan') show = c.dataset.offplan === 'true';
    else if(type === 'diaspora') show = c.dataset.diaspora === 'true';
    else if(type === 'mortgage') show = c.dataset.mortgage === 'true';
    if(show) { c.style.display = 'flex'; visible++; } else { c.style.display = 'none'; }
  });
  updateCount(visible);
  document.getElementById('opp-no-results').style.display = visible === 0 ? 'block' : 'none';
}

function oppFilter() {
  var q = (document.getElementById('opp-search')||{}).value.toLowerCase();
  var city = (document.getElementById('opp-city')||{}).value;
  var budget = (document.getElementById('opp-budget')||{}).value;
  var cards = document.querySelectorAll('.opp-card');
  var visible = 0;
  cards.forEach(function(c) {
    var title = c.querySelector('.opp-card-title').textContent.toLowerCase();
    var desc = (c.querySelector('.opp-desc')||{}).textContent.toLowerCase();
    var loc = (c.querySelector('.opp-meta-row')||{}).textContent.toLowerCase();
    var matchQ = !q || title.includes(q) || desc.includes(q) || loc.includes(q);
    var matchCity = !city || c.dataset.city === city;
    var matchBudget = true;
    if(budget) {
      var p = parseFloat(c.dataset.price);
      if(budget==='0-30') matchBudget = p <= 30;
      else if(budget==='30-100') matchBudget = p >= 30 && p <= 100;
      else if(budget==='100-300') matchBudget = p >= 100 && p <= 300;
      else if(budget==='300-1000') matchBudget = p >= 300 && p <= 1000;
      else if(budget==='1000+') matchBudget = p >= 1000;
    }
    var show = matchQ && matchCity && matchBudget;
    c.style.display = show ? 'flex' : 'none';
    if(show) visible++;
  });
  updateCount(visible);
  document.getElementById('opp-no-results').style.display = visible === 0 ? 'block' : 'none';
}

function oppSort() {
  var sort = document.getElementById('opp-sort').value;
  var grid = document.getElementById('opp-grid');
  var cards = Array.from(grid.querySelectorAll('.opp-card'));
  cards.sort(function(a,b){
    if(sort==='price-asc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
    if(sort==='price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
    if(sort==='newest') return new Date(b.dataset.date) - new Date(a.dataset.date);
    return 0;
  });
  cards.forEach(function(c){ grid.appendChild(c); });
}

function setView(v, btn) {
  var grid = document.getElementById('opp-grid');
  document.getElementById('view-grid').style.background = v==='grid' ? 'var(--forest)' : 'var(--white)';
  document.getElementById('view-grid').style.border = v==='grid' ? 'none' : '1px solid var(--border)';
  document.getElementById('view-list').style.background = v==='list' ? 'var(--forest)' : 'var(--white)';
  document.getElementById('view-list').style.border = v==='list' ? 'none' : '1px solid var(--border)';
  if(v==='list') grid.classList.add('list-view');
  else grid.classList.remove('list-view');
}

function updateCount(n) {
  var el = document.getElementById('opp-count');
  if(el) el.textContent = 'Showing ' + n + ' listing' + (n!==1?'s':'');
}

function resetOppFilters() {
  document.querySelectorAll('.pill-filter').forEach(b=>b.classList.remove('active'));
  var first = document.querySelector('.pill-filter');
  if(first) first.classList.add('active');
  document.querySelectorAll('.src-tab').forEach(t=>t.classList.remove('active'));
  var firstTab = document.querySelector('.src-tab');
  if(firstTab) firstTab.classList.add('active');
  if(document.getElementById('opp-search')) document.getElementById('opp-search').value='';
  if(document.getElementById('opp-city')) document.getElementById('opp-city').value='';
  if(document.getElementById('opp-budget')) document.getElementById('opp-budget').value='';
  document.querySelectorAll('.opp-card').forEach(c=>c.style.display='flex');
  updateCount(document.querySelectorAll('.opp-card').length);
  document.getElementById('opp-no-results').style.display='none';
}

function openEnquiry(title, price, source) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-price').textContent = price;
  document.getElementById('modal-source').textContent = source;
  document.getElementById('modal-success').style.display='none';
  document.getElementById('opp-modal').querySelector('form').style.display='flex';
  document.getElementById('opp-modal').style.display='flex';
  document.body.style.overflow='hidden';
}

function closeEnquiry() {
  document.getElementById('opp-modal').style.display='none';
  document.body.style.overflow='';
}

function saveProperty(btn, name) {
  btn.classList.toggle('saved');
  if(btn.classList.contains('saved')) {
    savedProperties.push(name);
  } else {
    savedProperties = savedProperties.filter(function(n){return n!==name;});
  }
  var tray = document.getElementById('saved-tray');
  var countEl = document.getElementById('saved-count');
  var pluralEl = document.getElementById('saved-plural');
  if(savedProperties.length > 0) {
    tray.style.display='flex';
    countEl.textContent = savedProperties.length;
    pluralEl.textContent = savedProperties.length===1 ? 'y' : 'ies';
  } else {
    tray.style.display='none';
  }
}

function showSavedProperties() {
  if(savedProperties.length===0) return;
  alert('Saved properties:\n\n' + savedProperties.map(function(n,i){return (i+1)+'. '+n;}).join('\n') + '\n\nEnquire about all of these - call us on 09049924198 or email info@fairdealng.com');
}

function filterP3(cat, btn) {
  document.querySelectorAll('#p3-grid .opp-card').forEach(function(c) {
    var title = c.querySelector('.opp-card-title').textContent.toLowerCase();
    var type  = c.dataset.type;
    var show  = false;
    if(cat === 'all') show = true;
    else if(cat === 'apartment') show = type === 'residential' && !title.includes('block');
    else if(cat === 'block') show = title.includes('block');
    else if(cat === 'land') show = type === 'land';
    c.style.display = show ? 'flex' : 'none';
  });
  // update active button
  btn.closest('div').querySelectorAll('.pill-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

export function attach(): void {
  const w = window as any;
  w.switchSource = switchSource;
  w.oppTypeFilter = oppTypeFilter;
  w.oppFilter = oppFilter;
  w.oppSort = oppSort;
  w.setView = setView;
  w.updateCount = updateCount;
  w.resetOppFilters = resetOppFilters;
  w.openEnquiry = openEnquiry;
  w.closeEnquiry = closeEnquiry;
  w.saveProperty = saveProperty;
  w.showSavedProperties = showSavedProperties;
  w.filterP3 = filterP3;
  w.savedProperties = savedProperties;
}
