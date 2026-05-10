/* ── NOVA TECH HUB · ELITE JS ANIMATION ENGINE ── */
(function () {
  'use strict';

  /* ─────────────── 1. LOADER ─────────────── */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    const fill = loader.querySelector('.loader-fill');
    const pct  = loader.querySelector('.loader-pct');
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 18;
      if (p > 100) p = 100;
      if (fill) fill.style.width = p + '%';
      if (pct)  pct.textContent  = Math.floor(p) + '%';
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          loader.style.transition = 'opacity .6s ease, transform .6s ease';
          loader.style.opacity    = '0';
          loader.style.transform  = 'scale(1.04)';
          setTimeout(() => loader.remove(), 650);
        }, 300);
      }
    }, 55);
  }

  /* ─────────────── 2. CUSTOM CURSOR ─────────────── */
  function initCursor() {
    const dot  = document.createElement('div'); dot.className  = 'cursor';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    // ring lags behind
    (function loop() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .card, .feature-card, .info-card, .preview-card, .panel-list li, .btn, .details-btn, .link-btn').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
    });

    // click ripple burst
    document.addEventListener('click', e => {
      const burst = document.createElement('div');
      burst.style.cssText = `
        position:fixed;width:12px;height:12px;border-radius:50%;
        background:var(--accent);pointer-events:none;z-index:99997;
        left:${e.clientX}px;top:${e.clientY}px;
        transform:translate(-50%,-50%);
        animation:cursorBurst .5s ease-out forwards;
      `;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 500);
    });

    const s = document.createElement('style');
    s.textContent = `
      @keyframes cursorBurst {
        to { transform:translate(-50%,-50%) scale(6); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ─────────────── 3. STICKY HEADER ─────────────── */
  function initHeader() {
    const hdr = document.querySelector('.site-header');
    if (!hdr) return;
    window.addEventListener('scroll', () =>
      hdr.classList.toggle('scrolled', window.scrollY > 50));
  }

  /* ─────────────── 4. PARTICLE CANVAS ─────────────── */
  function initParticles(container) {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    container.style.position = 'relative';
    container.prepend(canvas);
    const ctx = canvas.getContext('2d');

    function resize() { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a: Math.random(),
    }));

    let mouse = { x: -999, y: -999 };
    container.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    container.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        // repel from mouse
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += dx / dist * 0.4;
          p.vy += dy / dist * 0.4;
        }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.a * 0.7})`;
        ctx.fill();
      });

      // connect nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─────────────── 5. SCROLL REVEAL ─────────────── */
  function initReveal() {
    document.querySelectorAll('.feature-card, .card, .info-card, .preview-card, .panel-list li, .gallery-grid img, .hero-copy, .hero-panel, .hero-image')
      .forEach((el, i) => {
        el.classList.add('will-reveal');
        el.style.transitionDelay = (i % 6) * 0.08 + 's';
      });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.will-reveal, .will-reveal-left, .will-reveal-right').forEach(el => obs.observe(el));
  }

  /* ─────────────── 6. COUNTER ANIMATION ─────────────── */
  function initCounters() {
    const els = document.querySelectorAll('.stat-num[data-target]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.target, suffix = el.dataset.suffix || '';
        let cur = 0, step = target / 60;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = Math.floor(cur) + (cur >= target ? suffix : '');
          if (cur >= target) clearInterval(timer);
        }, 25);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    els.forEach(el => obs.observe(el));
  }

  /* ─────────────── 7. TYPING EFFECT ─────────────── */
  function initTyping() {
    document.querySelectorAll('[data-type]').forEach(el => {
      const words = el.dataset.type.split('|');
      let wi = 0, ci = 0, deleting = false;
      const span = document.createElement('span');
      const cur  = document.createElement('span');
      cur.className = 'type-cursor'; cur.textContent = '_';
      el.textContent = '';
      el.append(span, cur);

      setInterval(() => {
        const word = words[wi];
        if (!deleting) {
          span.textContent = word.slice(0, ++ci);
          if (ci >= word.length) { deleting = true; setTimeout(() => {}, 1200); }
        } else {
          span.textContent = word.slice(0, --ci);
          if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        }
      }, deleting ? 60 : 100);
    });
  }

  /* ─────────────── 8. MOUSE GLOW ON CARDS ─────────────── */
  function initMouseGlow() {
    document.querySelectorAll('.feature-card, .card, .info-card, .preview-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ─────────────── 9. 3D TILT ON CARDS ─────────────── */
  function initTilt() {
    document.querySelectorAll('.feature-card, .card, .info-card, .preview-card, .hero-copy, .hero-panel, .hero-image').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        card.style.transform = '';
        setTimeout(() => card.style.transition = '', 600);
      });
    });
  }

  /* ─────────────── 10. MAGNETIC BUTTONS ─────────────── */
  function initMagnetic() {
    document.querySelectorAll('.btn, .details-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform .5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.transform = '';
        setTimeout(() => btn.style.transition = '', 500);
      });
    });
  }

  /* ─────────────── 11. RIPPLE ON CLICK ─────────────── */
  function initRipple() {
    document.querySelectorAll('.btn, .details-btn, .link-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position:absolute;border-radius:50%;
          width:8px;height:8px;
          background:rgba(255,255,255,0.35);
          pointer-events:none;
          top:${e.clientY - r.top - 4}px;
          left:${e.clientX - r.left - 4}px;
          animation:rippleEffect .6s ease-out forwards;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    const s = document.createElement('style');
    s.textContent = `@keyframes rippleEffect { to { transform:scale(40); opacity:0; } }`;
    document.head.appendChild(s);
  }

  /* ─────────────── 12. PARALLAX ─────────────── */
  function initParallax() {
    const els = document.querySelectorAll('.hero-landing, .video-showcase');
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      els.forEach(el => {
        if (el.getBoundingClientRect().bottom > 0) {
          el.style.backgroundPositionY = `calc(center + ${sy * 0.3}px)`;
        }
      });
    });
  }

  /* ─────────────── 13. SMOOTH ANCHOR SCROLL ─────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  /* ─────────────── 14. SECTION TITLE UNDERLINE ─────────────── */
  function initSectionLines() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('section-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.features, .section-block').forEach(s => obs.observe(s));
  }

  /* ─────────────── 15. GLITCH on HEADER LOGO ─────────────── */
  function initGlitch() {
    const logo = document.querySelector('.brand h1');
    if (!logo) return;
    const orig = logo.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    let timer;
    logo.addEventListener('mouseenter', () => {
      let frame = 0;
      timer = setInterval(() => {
        logo.textContent = orig.split('').map((c, i) =>
          frame > i * 1.5 ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        if (++frame > orig.length * 2) { clearInterval(timer); logo.textContent = orig; }
      }, 35);
    });
    logo.addEventListener('mouseleave', () => { clearInterval(timer); logo.textContent = orig; });
  }

  /* ─────────────── BOOT ─────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initHeader();
    initMouseGlow();
    initTilt();
    initMagnetic();
    initRipple();
    initReveal();
    initCounters();
    initTyping();
    initParallax();
    initSmoothScroll();
    initSectionLines();
    initGlitch();

    // Particles on hero sections
    document.querySelectorAll('.hero, .hero-landing').forEach(hero => initParticles(hero));
  });

})();