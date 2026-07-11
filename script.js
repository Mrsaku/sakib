/**
 * Perfect Choice Cosmetics & Bangles
 * Luxury Interactive Script — FIXED VERSION
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements — all guarded with null checks
  const preloader = document.getElementById('preloader');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const cursorGlow = document.getElementById('cursor-glow');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const yearSpan = document.getElementById('year');

  // Set year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Preloader — hide on window.load OR after max 5 seconds (fixes slow image loading)
  let preloaderHidden = false;
  function hidePreloader() {
    if (preloaderHidden || !preloader) return;
    preloaderHidden = true;
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 5000); // Force hide after 5s no matter what

  // Cursor Glow
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // Navbar scroll effect
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Trigger counters if present
        entry.target.querySelectorAll('.counter').forEach(counter => {
          animateCounter(counter);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-section').forEach(el => {
    revealObserver.observe(el);
  });

  // Counter animation
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (!target || el.dataset.animated) return;
    el.dataset.animated = 'true';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Parallax for hero image
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }, { passive: true });
  }

  // Magnetic buttons
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        btn.style.setProperty('--x', `${(e.clientX - rect.left) / rect.width * 100}%`);
        btn.style.setProperty('--y', `${(e.clientY - rect.top) / rect.height * 100}%`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Ripple effect on click
  document.querySelectorAll('.btn, .cat-card, .gallery-item, .contact-row').forEach(el => {
    el.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ripple.classList.add('ripple');
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');
  if (navLinkEls.length && sections.length) {
    function setActiveNav() {
      let current = '';
      const offset = navbar ? navbar.offsetHeight + 100 : 150;
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - offset) {
          current = section.getAttribute('id');
        }
      });
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }
    window.addEventListener('scroll', setActiveNav, { passive: true });
  }

  // Gallery Lightbox
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.full;
        if (!src) return;
        lightboxImg.src = src;
        const imgEl = item.querySelector('img');
        lightboxImg.alt = imgEl ? imgEl.alt : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 400);
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Contact Form
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !phone || !message) {
        formNote.textContent = 'Please fill in all fields.';
        formNote.style.color = '#e74c3c';
        return;
      }
      formNote.textContent = 'Thank you! We will get back to you shortly.';
      formNote.style.color = 'var(--gold)';
      contactForm.reset();
      setTimeout(() => { formNote.textContent = ''; }, 5000);
    });
  }

  // Scroll cue hide on scroll
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollCue.style.opacity = '0';
      } else {
        scrollCue.style.opacity = '1';
      }
    }, { passive: true });
  }
});

