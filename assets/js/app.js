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


// === Carousel (CSS Scroll Snap + light JS) — 2025-08-31 ===
(function(){
  function initCarousel(root){
    var viewport = root.querySelector('.carousel__viewport');
    if(!viewport) return;

    // Slides
    var slides = Array.prototype.slice.call(viewport.querySelectorAll('.carousel__slide'));
    if(slides.length <= 1){
      root.classList.remove('is-multi');
    } else {
      root.classList.add('is-multi');
    }

    // Create dots based on slides
    var dotsHost = root.querySelector('.carousel__dots');
    if(dotsHost){
      dotsHost.innerHTML = '';
      slides.forEach(function(_, i){
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role','tab');
        b.setAttribute('aria-label','Go to slide ' + (i+1));
        b.addEventListener('click', function(){ goTo(i); });
        dotsHost.appendChild(b);
      });
    }

    // Buttons
    var prev = root.querySelector('.carousel__btn--prev');
    var next = root.querySelector('.carousel__btn--next');

    function slideWidth(){
      // Use first slide width including gap
      if(slides[0]){
        var rect = slides[0].getBoundingClientRect();
        return rect.width + parseFloat(getComputedStyle(viewport).columnGap || getComputedStyle(viewport).gap || 12);
      }
      return viewport.clientWidth;
    }

    function currentIndex(){
      // Find the slide whose left edge is closest to the viewport's scrollLeft
      var idx = 0;
      var min = Infinity;
      slides.forEach(function(slide, i){
        var offset = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        if(offset < min){ min = offset; idx = i; }
      });
      return idx;
    }

    function updateDots(idx){
      if(!dotsHost) return;
      var buttons = dotsHost.querySelectorAll('button');
      buttons.forEach(function(b, i){
        b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    function goTo(i){
      if(i < 0) i = 0;
      if(i > slides.length - 1) i = slides.length - 1;
      viewport.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
      updateDots(i);
    }

    function nextSlide(){ goTo(currentIndex() + 1); }
    function prevSlide(){ goTo(currentIndex() - 1); }

    if(prev) prev.addEventListener('click', prevSlide);
    if(next) next.addEventListener('click', nextSlide);

    // Update dots on scroll end (throttled)
    var t;
    viewport.addEventListener('scroll', function(){
      clearTimeout(t);
      t = setTimeout(function(){ updateDots(currentIndex()); }, 80);
    });

    // Keyboard support when viewport is focused
    viewport.setAttribute('tabindex','0');
    viewport.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ e.preventDefault(); nextSlide(); }
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); prevSlide(); }
    });

    // Initial state
    updateDots(0);

    // Resize observer: keep snapping accurate
    var ro = new ResizeObserver(function(){ updateDots(currentIndex()); });
    ro.observe(viewport);
  }

  // Auto-init all .carousel roots on DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.carousel').forEach(initCarousel);
  });
})();
