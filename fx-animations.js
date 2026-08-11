/**
 * FX Animations - 科技感动画效果 JS 模块
 * 集成方式：在 HTML </body> 前引入此脚本
 * 依赖：AOS (通过 CDN 引入，可选)
 */
(function () {
  'use strict';

  /* ========================================
     0. 主题切换系统
     ======================================== */
  function initTheme() {
    var html = document.documentElement;
    var toggleBtn = document.getElementById('theme-toggle');
    var iconSun = document.getElementById('theme-icon-sun');
    var iconMoon = document.getElementById('theme-icon-moon');

    // 从 localStorage 读取主题偏好，默认 dark
    var saved = localStorage.getItem('theme');
    var current = saved || 'dark';
    html.setAttribute('data-theme', current);
    updateThemeIcons(current);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcons(next);
      });
    }

    function updateThemeIcons(theme) {
      if (iconSun && iconMoon) {
        if (theme === 'dark') {
          iconSun.classList.add('hidden');
          iconMoon.classList.remove('hidden');
        } else {
          iconSun.classList.remove('hidden');
          iconMoon.classList.add('hidden');
        }
      }
    }
  }

  /* ========================================
     1. 粒子背景系统（主题感知）
     ======================================== */
  function initParticles() {
    var canvas = document.getElementById('fx-particles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 80;
    var CONNECT_DISTANCE = 140;
    var mouseX = -1000;
    var mouseY = -1000;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
      };
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    // 获取当前主题的粒子颜色
    function getParticleColor(alpha) {
      var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      var r = 0, g = 170, b = 255; // 默认蓝色
      if (!isDark) {
        // 白天主题：使用更深的蓝色
        r = 74; g = 144; b = 217;
      }
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // 更新位置
        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 鼠标吸引
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 200) {
          p.x += dx * 0.002;
          p.y += dy * 0.002;
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.alpha);
        ctx.fill();
        // 光晕
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.alpha * 0.15);
        ctx.fill();

        // 连线
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx2 = p.x - p2.x;
          var dy2 = p.y - p2.y;
          var dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < CONNECT_DISTANCE) {
            var opacity = (1 - dist / CONNECT_DISTANCE) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = getParticleColor(opacity);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* ========================================
     2. 3D 卡片倾斜效果
     ======================================== */
  function init3DCards() {
    var cards = document.querySelectorAll('.fx-card-3d');

    function handleMouseMove(e) {
      var card = this;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / centerY * -8;
      var rotateY = (x - centerX) / centerX * 8;

      card.style.transform =
        'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    }

    function handleMouseLeave() {
      this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('mousemove', handleMouseMove);
      cards[i].addEventListener('mouseleave', handleMouseLeave);
    }
  }

  /* ========================================
     3. 毛玻璃导航栏滚动检测
     ======================================== */
  function initNavbar() {
    var navbar = document.querySelector('.fx-navbar');
    if (!navbar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ========================================
     4. Hero 覆盖：检测到下滑后内容区快速弹起覆盖全屏
        只需动一下鼠标滚轮，内容区即平滑滑上覆盖 Hero
     ======================================== */
  function initHeroCover() {
    var hero = document.querySelector('.fx-hero');
    var content = document.querySelector('.fx-content');
    if (!hero || !content) return;

    var triggered = false;

    // 回到顶部时重置，允许再次触发
    window.addEventListener('scroll', function () {
      if (window.scrollY <= 5) {
        triggered = false;
      }
    }, { passive: true });

    // 拦截滚轮事件：向下滚动时阻止默认行为，改为一次性平滑弹起覆盖
    window.addEventListener('wheel', function (e) {
      if (triggered) return;
      if (e.deltaY > 0) {
        e.preventDefault();
        triggered = true;
        var contentTop = content.getBoundingClientRect().top;
        var heroTop = hero.getBoundingClientRect().top;
        var scrollBy = contentTop - heroTop;
        if (scrollBy > 0) {
          window.scrollBy({
            top: scrollBy,
            behavior: 'smooth'
          });
        }
      }
    }, { passive: false });
  }

  /* ========================================
     5. Hero 标题回顶重触发 + 下滑提示显隐
     ======================================== */
  function initHeroReveal() {
    var heroItems = document.querySelectorAll('.fx-float-up');
    var scrollHint = document.querySelector('.fx-scroll-hint');
    if (!heroItems.length) return;

    var wasAtTop = true;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var isAtTop = window.scrollY <= 5;

          // 下滑提示：滚动后淡出，回顶后淡入
          if (scrollHint) {
            if (isAtTop) {
              scrollHint.classList.remove('hidden');
            } else {
              scrollHint.classList.add('hidden');
            }
          }

          // 回顶时重新触发标题浮现动画
          if (isAtTop && !wasAtTop) {
            for (var i = 0; i < heroItems.length; i++) {
              var el = heroItems[i];
              el.style.animation = 'none';
              el.offsetHeight; // 强制回流，重置动画
              el.style.animation = '';
            }
          }

          wasAtTop = isAtTop;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ========================================
     6. AOS 初始化
     ======================================== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
      });
    }
  }

  /* ========================================
     7. 启动
     ======================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initParticles();
    init3DCards();
    initNavbar();
    initHeroCover();
    initHeroReveal();
    initAOS();
  });
})();