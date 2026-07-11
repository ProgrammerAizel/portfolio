/* =============================================
   AIZEL LINTO — script.js
   noth.in-inspired magnetic cursor + interactions
   ============================================= */

// ─── MAGNETIC CURSOR (noth.in style) ───────────────────────────────────────
const cursorEl = document.getElementById('cursor');
const cursorInner = cursorEl.querySelector('.cursor-inner');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;
let isMoving = false;

// Smooth cursor follow via RAF
function lerpCursor() {
  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;
  cursorEl.style.left = curX + 'px';
  cursorEl.style.top  = curY + 'px';
  requestAnimationFrame(lerpCursor);
}
lerpCursor();

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Cursor states
document.querySelectorAll('a, button, [data-magnetic], .skill-tag, .p-tag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
});

// ─── MAGNETIC PULL EFFECT ──────────────────────────────────────────────────
document.querySelectorAll('[data-magnetic]').forEach(el => {
  const strength = 0.3;

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    el.style.transition = 'transform 0.2s ease';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
  });
});

// ─── NAV SCROLL ────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── MOBILE MENU ───────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const [s1, s2, s3] = navToggle.querySelectorAll('span');
  if (menuOpen) {
    s1.style.transform = 'translateY(6.5px) rotate(45deg)';
    s2.style.opacity   = '0';
    s3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMobile() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ─── HERO ROLE CYCLE ───────────────────────────────────────────────────────
const roles = document.querySelectorAll('.role-item');
let roleIdx = 0;
setInterval(() => {
  roles[roleIdx].classList.remove('active');
  roleIdx = (roleIdx + 1) % roles.length;
  roles[roleIdx].classList.add('active');
}, 2400);

// ─── COUNTER ANIMATION ─────────────────────────────────────────────────────
function countUp(el, target, duration = 1800) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

// ─── INTERSECTION OBSERVER ─────────────────────────────────────────────────
const obsOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const obs = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;

    if (target.classList.contains('stat-num')) {
      countUp(target, parseInt(target.dataset.target));
    } else if (target.classList.contains('skill-bar')) {
      target.style.width = target.dataset.width + '%';
    } else if (target.classList.contains('reveal') ||
               target.classList.contains('pillar-card') ||
               target.classList.contains('skill-category') ||
               target.classList.contains('project-item') ||
               target.classList.contains('timeline-item')) {
      const delay = parseInt(target.dataset.delay || 0);
      setTimeout(() => target.classList.add('visible'), delay);
    }
    obs.unobserve(target);
  });
}, obsOptions);

document.querySelectorAll(
  '.stat-num, .skill-bar, .reveal, .pillar-card, .skill-category, .project-item, .timeline-item'
).forEach(el => obs.observe(el));

// ─── FLOATING PHOTO PARALLAX ───────────────────────────────────────────────
const floatPhoto = document.getElementById('floatPhoto');
if (floatPhoto && window.innerWidth > 900) {
  let photoX = 0, photoY = 0;
  document.addEventListener('mousemove', (e) => {
    const tx = (e.clientX / window.innerWidth  - 0.5) * 22;
    const ty = (e.clientY / window.innerHeight - 0.5) * 16;
    photoX += (tx - photoX) * 0.06;
    photoY += (ty - photoY) * 0.06;
  });
  // Run on RAF
  function updatePhoto() {
    if (floatPhoto) {
      floatPhoto.style.transform = `translateY(-50%) translate(${photoX}px, ${photoY}px)`;
    }
    requestAnimationFrame(updatePhoto);
  }
  updatePhoto();
}

// ─── NAV ACTIVE STATE ──────────────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links .nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-links .nav-link[href="#${target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => sectionObs.observe(s));

// ─── PROJECT ITEM TILT ─────────────────────────────────────────────────────
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const r = item.getBoundingClientRect();
    const tx = (e.clientX - r.left)  / r.width  - 0.5;
    const ty = (e.clientY - r.top)   / r.height - 0.5;
    item.style.transform = `perspective(1200px) rotateX(${ty * 3}deg) rotateY(${tx * -3}deg) translateZ(6px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ─── SMOOTH MARQUEE PAUSE ON HOVER ────────────────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ─── CONTACT FORM ──────────────────────────────────────────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('form-submit');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.opacity = '1';
    success.classList.add('show');
    e.target.reset();
    setTimeout(() => success.classList.remove('show'), 4500);
  }, 1400);
}

// ─── PAGE LOAD FADE ────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// ─── SKILL TAG RIPPLE ──────────────────────────────────────────────────────
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', (e) => {
    const r = document.createElement('span');
    r.style.cssText = `
      position:absolute; border-radius:50%; transform:scale(0);
      animation:ripple 0.5s linear; background:rgba(255,255,255,0.25);
      width:60px; height:60px; left:${e.offsetX - 30}px; top:${e.offsetY - 30}px;
      pointer-events:none;
    `;
    tag.style.position = 'relative'; tag.style.overflow = 'hidden';
    tag.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

// Ripple keyframe injection
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}';
document.head.appendChild(style);
