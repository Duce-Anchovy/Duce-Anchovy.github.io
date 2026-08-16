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

    // 主页：主题切换时用 clip-path 遮罩扫过背景（从右往左）
    // 叠加一层"新主题渐变背景"，右侧先露出、向左裁剪推进，扫完移除
    function sweepBackground(next) {
      var overlay = document.createElement('div');
      overlay.className = 'fx-sweep-overlay ' + (next === 'dark' ? 'sweep-dark' : 'sweep-light');
      // 插入到粒子 canvas 之前，让粒子光效浮在扫过层之上
      var particles = document.getElementById('fx-particles');
      if (particles && particles.parentNode) {
        particles.parentNode.insertBefore(overlay, particles);
      } else {
        document.body.appendChild(overlay);
      }
      // 等一帧确保 overlay 已渲染，再触发动画
      requestAnimationFrame(function () {
        overlay.classList.add('sweep-active');
      });
      // 动画结束后移除 overlay
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 900);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        var isHome = html.getAttribute('data-page') === 'home';

        html.classList.add('theme-transitioning');
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcons(next);

        // 主页：叠加背景扫过层
        if (isHome) {
          sweepBackground(next);
        }

        setTimeout(function () {
          html.classList.remove('theme-transitioning');
        }, 1500);
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
     1. 3D 卡片倾斜效果
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
     2. 毛玻璃导航栏滚动检测
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
     3. Hero 覆盖：检测到下滑后内容区快速弹起覆盖全屏
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
     4. Hero 标题回顶重触发 + 下滑箭头显隐
     ======================================== */
  function initHeroReveal() {
    var heroItems = document.querySelectorAll('.fx-float-up');
    var scrollArrow = document.querySelector('.fx-scroll-arrow');
    if (!heroItems.length) return;

    var wasAtTop = true;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var isAtTop = window.scrollY <= 5;

          // 下滑箭头：滚动后淡出，回顶后淡入
          if (scrollArrow) {
            if (isAtTop) {
              scrollArrow.classList.remove('hidden');
            } else {
              scrollArrow.classList.add('hidden');
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
     5. 下滑箭头点击：平滑滚动到内容区
     ======================================== */
  function initScrollArrow() {
    var arrow = document.querySelector('.fx-scroll-arrow');
    var content = document.querySelector('.fx-content');
    if (!arrow || !content) return;

    arrow.addEventListener('click', function () {
      var top = content.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ========================================
     6. 亮色模式点阵视差（轻微鼠标跟随）
     ======================================== */
  function initDotParallax() {
    var dotPattern = document.getElementById('fx-dot-pattern');
    if (!dotPattern) return;

    var ticking = false;
    document.addEventListener('mousemove', function (e) {
      if (!ticking) {
        requestAnimationFrame(function () {
          var isLight = document.documentElement.getAttribute('data-theme') === 'light';
          if (!isLight) {
            dotPattern.style.transform = '';
            ticking = false;
            return;
          }
          // 轻微偏移，范围 ±5px
          var x = (e.clientX / window.innerWidth - 0.5) * 10;
          var y = (e.clientY / window.innerHeight - 0.5) * 10;
          dotPattern.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ========================================
     7. AOS 初始化
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
     8. 启动
     ======================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    init3DCards();
    initNavbar();
    initHeroCover();
    initHeroReveal();
    initScrollArrow();
    initDotParallax();
    initAOS();
  });
})();