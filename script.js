const sections = [...document.querySelectorAll('main section[id]')];
const dotLinks = [...document.querySelectorAll('.dot-link')];
const navToggle = document.querySelector('#navToggle');
const dotList = document.querySelector('#dotList');
const year = document.querySelector('#year');

function setActiveSection(id) {
  dotLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  const visibleSection = entries
    .filter((entry) => entry.isIntersecting)
    .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

  if (visibleSection) setActiveSection(visibleSection.target.id);
}, {
  rootMargin: '-35% 0px -50% 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1]
});

sections.forEach((section) => sectionObserver.observe(section));

dotLinks.forEach((link) => {
  link.addEventListener('click', () => {
    dotList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

navToggle.addEventListener('click', () => {
  const isOpen = dotList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

if (year) year.textContent = new Date().getFullYear();
