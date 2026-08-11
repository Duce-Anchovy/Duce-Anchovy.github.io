/**
 * Canvas 粒子系统（仅暗色模式运行）
 * 品牌色：蓝(#60a5fa)、紫(#a78bfa)、青(#22d3ee)
 * 亮色模式下自动隐藏，使用 CSS dot pattern 替代
 * 零外部依赖，纯原生 JS
 */
(function () {
  'use strict';

  var canvas = document.getElementById('fx-particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');

  /* ========================================
     配置
     ======================================== */
  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT = isMobile ? 40 : 70;
  var CONNECT_DISTANCE = isMobile ? 100 : 150;
  var MOUSE_ATTRACT_DIST = 100;
  var MOUSE_ATTRACT_FORCE = 0.015;

  var particles = [];
  var mouseX = -1000;
  var mouseY = -1000;
  var animFrameId = null;
  var isRunning = false;

  /* 品牌色系 */
  var BRAND_COLORS = [
    { r: 96,  g: 165, b: 250 },  // 蓝 #60a5fa
    { r: 167, g: 139, b: 250 },  // 紫 #a78bfa
    { r: 34,  g: 211, b: 238 },  // 青 #22d3ee
  ];

  /* ========================================
     主题检测
     ======================================== */
  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function updateVisibility() {
    if (isDarkMode()) {
      canvas.style.display = '';
      if (!isRunning) {
        isRunning = true;
        draw();
      }
    } else {
      canvas.style.display = 'none';
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  }

  /* ========================================
     初始化
     ======================================== */
  function resize() {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
    isMobile = window.innerWidth < 768;
  }

  function randomColor() {
    var c = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
    return c;
  }

  function createParticle() {
    var c = randomColor();
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 2,
      color: c,
      alpha: Math.random() * 0.45 + 0.4,
    };
  }

  function populateParticles(count) {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  /* ========================================
     绘制
     ======================================== */
  function rgbaStr(c, alpha) {
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  }

  function draw() {
    if (!isRunning) return;

    var w = window.innerWidth;
    var h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // 移动
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // 边界钳制
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));

      // 鼠标吸引
      var dx = mouseX - p.x;
      var dy = mouseY - p.y;
      var distToMouse = Math.sqrt(dx * dx + dy * dy);
      if (distToMouse < MOUSE_ATTRACT_DIST) {
        var force = (1 - distToMouse / MOUSE_ATTRACT_DIST) * MOUSE_ATTRACT_FORCE;
        p.x += dx * force;
        p.y += dy * force;
      }

      // 粒子本体 + 发光晕
      ctx.save();
      ctx.shadowColor = rgbaStr(p.color, 0.6);
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = rgbaStr(p.color, p.alpha);
      ctx.fill();
      ctx.restore();

      // 连线
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx2 = p.x - p2.x;
        var dy2 = p.y - p2.y;
        var dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist < CONNECT_DISTANCE) {
          var lineOpacity = (1 - dist / CONNECT_DISTANCE) * 0.25;
          var midColor = {
            r: Math.round((p.color.r + p2.color.r) / 2),
            g: Math.round((p.color.g + p2.color.g) / 2),
            b: Math.round((p.color.b + p2.color.b) / 2),
          };
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = rgbaStr(midColor, lineOpacity);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // 鼠标光晕圆
    if (mouseX > 0 && mouseY > 0) {
      var gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 60);
      gradient.addColorStop(0, 'rgba(96,165,250,0.15)');
      gradient.addColorStop(0.5, 'rgba(167,139,250,0.06)');
      gradient.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 60, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    animFrameId = requestAnimationFrame(draw);
  }

  /* ========================================
     事件
     ======================================== */
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  function onResize() {
    resize();
    var newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      CONNECT_DISTANCE = isMobile ? 100 : 150;
      var newCount = isMobile ? 40 : 70;
      if (newCount !== particles.length) {
        populateParticles(newCount);
      }
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    } else {
      if (!isRunning && isDarkMode()) {
        isRunning = true;
        draw();
      }
    }
  }

  /* ========================================
     启动
     ======================================== */
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  // 监听主题切换
  var themeObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === 'data-theme') {
        updateVisibility();
        break;
      }
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  populateParticles(PARTICLE_COUNT);
  updateVisibility();
})();