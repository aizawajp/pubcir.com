document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('globalNav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 72;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // --- Active Nav Link Highlight (TOP page only) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.global-nav a[href^="#"]');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.pageYOffset + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // --- Demo Preview Canvases ---
  drawPreviewProduction();
  drawPreviewQuality();
  drawPreviewMaintenance();
});

// --- Production Monitor Preview ---
function drawPreviewProduction() {
  const canvas = document.getElementById('previewProduction');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('🏭 生産ライン監視ダッシュボード', 12, 18);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('● 接続中', W - 70, 18);

    // 2 mini cards
    const cards = [
      { name: 'Assembly Line #1', ct: (9.5 + Math.random() * 1.5).toFixed(1), prod: Math.floor(510 + Math.random() * 30), color: '#22c55e' },
      { name: 'Inspection Line #1', ct: (17 + Math.random() * 3).toFixed(1), prod: Math.floor(300 + Math.random() * 20), color: '#ef4444' }
    ];

    cards.forEach((c, i) => {
      const x = 10 + i * 195, y = 30, w = 185, h = 75;
      ctx.strokeStyle = c.color + '66';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(30,58,138,0.5)';
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#E5E7EB';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(c.name, x + 8, y + 16);

      // Status badge
      ctx.fillStyle = c.color;
      ctx.font = '8px sans-serif';
      const label = c.color === '#22c55e' ? '稼働中' : '警戒';
      ctx.fillText(label, x + w - 30, y + 16);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '8px sans-serif';
      ctx.fillText('CT', x + 8, y + 34);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(c.ct, x + 8, y + 56);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '8px sans-serif';
      ctx.fillText('秒', x + 50, y + 56);

      ctx.fillText('生産数', x + 90, y + 34);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(c.prod, x + 90, y + 56);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '8px sans-serif';
      ctx.fillText('/ 800', x + 130, y + 56);

      // Progress bar
      const pct = c.prod / 800;
      ctx.fillStyle = '#1e3a5f';
      roundRect(ctx, x + 8, y + 63, w - 16, 5, 2); ctx.fill();
      ctx.fillStyle = c.color;
      roundRect(ctx, x + 8, y + 63, (w - 16) * pct, 5, 2); ctx.fill();
    });

    // Mini line chart
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let j = 0; j < 30; j++) {
      const x = 10 + j * (W - 20) / 29;
      const y = 140 + Math.sin(j * 0.5 + Date.now() / 1000) * 20 + Math.random() * 8;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Chart label
    ctx.fillStyle = '#64748B';
    ctx.font = '8px sans-serif';
    ctx.fillText('サイクルタイム推移', 12, 125);

    // Axis lines
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(10, 210); ctx.lineTo(W - 10, 210);
    ctx.stroke();
  }

  draw();
  setInterval(draw, 2000);
}

// --- Quality Inspection Preview ---
function drawPreviewQuality() {
  const canvas = document.getElementById('previewQuality');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, W, H);

    // Red header
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, W, 24);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('☑ 品質検査データ可視化システム', 8, 16);

    // KPI row
    const kpis = [
      { label: '検査総数', val: '' + (160 + Math.floor(Math.random() * 8)), color: '#0F172A' },
      { label: '合格品数', val: '' + (150 + Math.floor(Math.random() * 8)), color: '#22c55e' },
      { label: '不良品数', val: '' + (7 + Math.floor(Math.random() * 5)), color: '#f97316' },
      { label: 'NG率', val: (4 + Math.random() * 3).toFixed(1) + '%', color: '#ef4444' }
    ];

    kpis.forEach((k, i) => {
      const x = 8 + i * 98, y = 32, w = 90, h = 42;
      ctx.fillStyle = '#fff';
      roundRect(ctx, x, y, w, h, 4); ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      roundRect(ctx, x, y, w, h, 4); ctx.stroke();

      ctx.fillStyle = k.color;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(k.val, x + w / 2, y + 24);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '7px sans-serif';
      ctx.fillText(k.label, x + w / 2, y + 38);
      ctx.textAlign = 'left';
    });

    // Bar chart area
    ctx.fillStyle = '#fff';
    roundRect(ctx, 8, 82, 190, 128, 4); ctx.fill();
    ctx.fillStyle = '#64748B';
    ctx.font = '8px sans-serif';
    ctx.fillText('📊 NG原因パレート図', 14, 96);

    const bars = [40, 38, 36, 35, 32, 28, 25];
    bars.forEach((v, i) => {
      const bx = 18 + i * 24, by = 200 - v * 2.2, bw = 16, bh = v * 2.2;
      ctx.fillStyle = '#f97316';
      roundRect(ctx, bx, by, bw, bh, 2); ctx.fill();
    });

    // Donut chart area
    ctx.fillStyle = '#fff';
    roundRect(ctx, 206, 82, 186, 128, 4); ctx.fill();
    ctx.fillStyle = '#64748B';
    ctx.font = '8px sans-serif';
    ctx.fillText('🔵 製品別NG率', 212, 96);

    const slices = [
      { pct: 0.30, color: '#ef4444' },
      { pct: 0.25, color: '#ec4899' },
      { pct: 0.20, color: '#3b82f6' },
      { pct: 0.15, color: '#8b5cf6' },
      { pct: 0.10, color: '#1e3a8a' }
    ];
    let startAngle = -Math.PI / 2;
    const cx = 300, cy = 160, r = 32;
    slices.forEach(s => {
      const endAngle = startAngle + s.pct * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      startAngle = endAngle;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  draw();
  setInterval(draw, 3000);
}

// --- Maintenance Preview ---
function drawPreviewMaintenance() {
  const canvas = document.getElementById('previewMaintenance');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, W, 24);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('🔧 設備メンテナンス管理システム', 8, 16);

    // Stats row
    const stats = [
      { label: 'MTBF(h)', val: (180 + Math.random() * 10).toFixed(1) },
      { label: 'MTTR(h)', val: (5 + Math.random() * 2).toFixed(1) },
      { label: '故障(90日)', val: '' + (10 + Math.floor(Math.random() * 3)) },
      { label: '稼働率', val: (96 + Math.random() * 2).toFixed(1) + '%' }
    ];

    stats.forEach((s, i) => {
      const x = 8 + i * 98, y = 32, w = 90, h = 42;
      ctx.fillStyle = '#334155';
      roundRect(ctx, x, y, w, h, 4); ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.val, x + w / 2, y + 24);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '7px sans-serif';
      ctx.fillText(s.label, x + w / 2, y + 38);
      ctx.textAlign = 'left';
    });

    // Equipment cards
    const equips = [
      { name: 'CNC加工機 #1', status: '正常', color: '#22c55e' },
      { name: 'プレス機 #1', status: '正常', color: '#22c55e' },
      { name: '溶接ロボット #1', status: '正常', color: '#22c55e' },
      { name: '塗装ブース #1', status: '期限超過', color: '#f97316' }
    ];

    equips.forEach((eq, i) => {
      const x = 8 + i * 98, y = 84, w = 90, h = 56;
      ctx.fillStyle = '#fff';
      roundRect(ctx, x, y, w, h, 4); ctx.fill();

      // Left border
      ctx.fillStyle = eq.color;
      ctx.fillRect(x, y + 2, 3, h - 4);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(eq.name, x + 8, y + 16);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '7px sans-serif';
      ctx.fillText('次回点検: 2026/3', x + 8, y + 30);

      // Status bar
      ctx.fillStyle = eq.color + '22';
      roundRect(ctx, x + 4, y + h - 16, w - 8, 12, 3); ctx.fill();
      ctx.fillStyle = eq.color;
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(eq.status, x + w / 2, y + h - 7);
      ctx.textAlign = 'left';
    });

    // More equipment hint
    ctx.fillStyle = '#94A3B8';
    ctx.font = '8px sans-serif';
    ctx.fillText('...他 4台の設備', 8, H - 68);

    // Maintenance history
    ctx.fillStyle = '#fff';
    roundRect(ctx, 8, H - 60, W - 16, 50, 4); ctx.fill();
    ctx.fillStyle = '#64748B';
    ctx.font = '8px sans-serif';
    ctx.fillText('📋 メンテナンス履歴', 14, H - 44);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '7px sans-serif';
    ctx.fillText('CNC加工機 #1  |  定期点検  |  2026/02/20  |  完了', 14, H - 30);
    ctx.fillText('プレス機 #1  |  ベアリング交換  |  2026/01/15  |  完了', 14, H - 18);
  }

  draw();
  setInterval(draw, 3000);
}

// Utility: rounded rect
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
