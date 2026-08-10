/**
 * FX Animations - 科技感动画效果 JS 模块
 * 集成方式：在 HTML </body> 前引入此脚本
 * 依赖：AOS (通过 CDN 引入，可选)
 */
(function () {
  'use strict';

  /* ========================================
     1. 粒子背景系统
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
        ctx.fillStyle = 'rgba(0, 170, 255, ' + p.alpha + ')';
        ctx.fill();
        // 光晕
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 170, 255, ' + (p.alpha * 0.15) + ')';
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
            ctx.strokeStyle = 'rgba(0, 170, 255, ' + opacity + ')';
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
     4. AOS 初始化
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
     5. 启动
     ======================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    init3DCards();
    initNavbar();
    initAOS();
  });
})();