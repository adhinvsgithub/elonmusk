/* ══════════════════════════════════════════
   ELON MUSK PORTFOLIO — script.js
   Features:
     1. Custom cursor tracking
     2. Scroll reveal (IntersectionObserver)
     3. Animated stat counters
     4. Quote slider with dots
══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Track raw mouse position
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Outer ring has slight lag (smooth lerp)
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();


/* ─────────────────────────────────────────
   2. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(el); // fire once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealEls.forEach((el) => revealObserver.observe(el));


/* ─────────────────────────────────────────
   3. ANIMATED STAT COUNTERS
───────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-card__num[data-count]');

function animateCount(el, target, duration = 1800) {
  const startTime = performance.now();
  const start     = 0;

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value  = Math.floor(start + (target - start) * eased);

    el.textContent = value.toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(update);
}

// Trigger counters when section enters viewport
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNums.forEach((el) => {
          const target = parseInt(el.dataset.count, 10);
          animateCount(el, target);
        });
        statsObserver.disconnect(); // run once
      }
    });
  },
  { threshold: 0.4 }
);

const numbersSection = document.getElementById('numbers');
if (numbersSection) statsObserver.observe(numbersSection);


/* ─────────────────────────────────────────
   4. QUOTE SLIDER
───────────────────────────────────────── */
const quotes     = document.querySelectorAll('.quote-card');
const dotsWrap   = document.getElementById('quotesDots');
const prevBtn    = document.getElementById('prevQuote');
const nextBtn    = document.getElementById('nextQuote');

let current = 0;

// Build dots dynamically
quotes.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  // Bounds wrap
  current = (index + quotes.length) % quotes.length;

  // Update cards
  quotes.forEach((q, i) => {
    q.classList.toggle('active', i === current);
  });

  // Update dots
  const dots = dotsWrap.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

// Button events
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// Auto-rotate every 5 seconds
let autoPlay = setInterval(() => goTo(current + 1), 5000);

// Pause on hover
const sliderEl = document.getElementById('quotesSlider');
sliderEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
sliderEl.addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => goTo(current + 1), 5000);
});


/* ─────────────────────────────────────────
   5. ACTIVE NAV HIGHLIGHT (scroll spy)
───────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav__links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive
            ? 'var(--accent)'
            : 'var(--text-dim)';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => navObserver.observe(s));


/* ─────────────────────────────────────────
   6. HERO PARALLAX (subtle)
───────────────────────────────────────── */
const heroGrid = document.querySelector('.hero__grid-lines');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroGrid) {
    heroGrid.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
});
