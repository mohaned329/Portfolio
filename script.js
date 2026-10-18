const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children].filter((item) => item.classList.contains('reveal'));
      const position = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(position * 90, 270)}ms`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13 });
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  navLinks.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  navLinks.classList.toggle('open', !open);
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const progressBar = document.querySelector('.scroll-progress');
let scrollFrame = 0;
function updateScrollProgress() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    scrollFrame = 0;
  });
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

const projectCursor = document.querySelector('.project-cursor');
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const visual = document.querySelector('.hero-visual');
  const orbits = visual.querySelectorAll('.hero-orbit');
  visual.addEventListener('pointermove', (event) => {
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    orbits.forEach((orbit, index) => {
      orbit.style.translate = `${x * (index + 1) * 7}px ${y * (index + 1) * 6}px`;
    });
  });
  visual.addEventListener('pointerleave', () => orbits.forEach((orbit) => { orbit.style.translate = ''; }));

  document.querySelectorAll('.project').forEach((project) => {
    project.addEventListener('pointerenter', () => projectCursor.classList.add('visible'));
    project.addEventListener('pointerleave', () => projectCursor.classList.remove('visible'));
  });
  window.addEventListener('pointermove', (event) => {
    projectCursor.style.left = `${event.clientX}px`;
    projectCursor.style.top = `${event.clientY}px`;
    projectCursor.style.transform = 'translate(-50%, -50%)';
  }, { passive: true });
}

document.querySelector('#year').textContent = new Date().getFullYear();
