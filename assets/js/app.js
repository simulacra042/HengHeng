
// Minimal JS for the HengHeng site
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
})();

// Mobile menu toggle
(function(){
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav__toggle');
  if (nav && btn){
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

// Single-open behavior for card accordions
document.querySelectorAll('.card__accordion').forEach(acc => {
  const items = acc.querySelectorAll('details.acc');
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        items.forEach(other => { if (other !== d) other.open = false; });
      }
    });
  });
});

// Sticky header shadow on scroll (minimal)
(function(){
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 0);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();
