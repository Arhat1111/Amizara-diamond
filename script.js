(() => {
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }));

  const revealItems = document.querySelectorAll('.reveal, .reveal-image');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('in-view'));
  }

  const parallax = [...document.querySelectorAll('.parallax-media')];
  let ticking = false;

  function update() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 35);

    if (!reduceMotion) {
      parallax.forEach(el => {
        const parent = el.parentElement;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < -150 || rect.top > innerHeight + 150) return;
        const speed = Number(el.dataset.speed || .08);
        const offset = (innerHeight * .5 - (rect.top + rect.height * .5)) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive:true });
  update();
})();
