// Minimal JS: year + carousel buttons + dots (NO tour text here)
document.getElementById('year').textContent = new Date().getFullYear();

const carousel = document.getElementById('tourCarousel');
const dots = document.getElementById('dots');
const cards = Array.from(document.querySelectorAll('.card'));

// Build dots based on static cards
dots.innerHTML = cards.map((_, i) => `<button data-i="${i}" aria-label="Go to card ${i+1}"></button>`).join('');

function updateDots(){
  if (!cards.length) return;
  const cardWidth = cards[0].offsetWidth + 16; // plus gap
  const index = Math.round(carousel.scrollLeft / cardWidth);
  dots.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('active', i===index));
}
updateDots();
carousel.addEventListener('scroll', () => requestAnimationFrame(updateDots));

  carousel.scrollBy({ left: -(carousel.clientWidth * 0.9), behavior: 'smooth' });
});
  carousel.scrollBy({ left: (carousel.clientWidth * 0.9), behavior: 'smooth' });
});

dots.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-i]');
  if(!btn) return;
  const i = +btn.dataset.i;
  cards[i]?.scrollIntoView({behavior:'smooth', inline:'start'});
});