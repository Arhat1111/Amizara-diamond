(() => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  menuBtn?.addEventListener('click', () => {
    const open = mobileMenu?.classList.toggle('open');
    mobileMenu?.setAttribute('aria-hidden', open ? 'false' : 'true');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('img').forEach(img => {
    const markError = () => img.classList.add('image-error');
    img.addEventListener('error', markError);
    if (img.complete && img.naturalWidth === 0) markError();
  });

  const reveals = document.querySelectorAll('.reveal,.reveal-img');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  const parallax = [...document.querySelectorAll('.parallax')];
  let ticking = false;
  const update = () => {
    header?.classList.toggle('scrolled', scrollY > 24);
    if (!reduced) {
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > innerHeight + 120) return;
        const speed = Number(el.dataset.speed || .035);
        const y = (innerHeight * .5 - (r.top + r.height * .5)) * speed;
        el.style.transform = `translate3d(0,${y}px,0) scale(1.035)`;
      });
    }
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();

  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dot')];
  let current = 0;
  let timer;
  const show = index => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };
  const start = () => {
    if (slides.length > 1 && !reduced) timer = setInterval(() => show(current + 1), 5200);
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(timer);
    show(i);
    start();
  }));
  show(0);
  start();

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    if (status) status.textContent = 'Thank you. This form is ready to be connected to your email, WhatsApp or backend.';
    form.reset();
  });
})();
