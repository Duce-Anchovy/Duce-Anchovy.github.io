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
        // DEBUG: 按钮变红，确认 click 处理器执行
        toggleBtn.style.outline = '3px solid red';
        setTimeout(function () { toggleBtn.style.outline = ''; }, 2000);

        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

        // 主页：在切换主题前，直接设 transition 简写 inline style（含 delay），从右往左扫过
        var heroEls;
        if (html.getAttribute('data-page') === 'home') {
          var hero = document.querySelector('.fx-hero');
          if (hero) {
            var container = hero.querySelector('div');
            if (container) {
              var containerRect = container.getBoundingClientRect();
              heroEls = hero.querySelectorAll('*');
              heroEls.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                var centerX = rect.left + rect.width / 2;
                var ratio = 1 - (centerX - containerRect.left) / containerRect.width;
                ratio = Math.max(0, Math.min(1, ratio));
                var delay = (ratio * 0.6).toFixed(3) + 's';
                el.style.setProperty('transition',
                  'background-color 0.8s ease ' + delay + ', ' +
                  'color 0.8s ease ' + delay + ', ' +
                  'border-color 0.8s ease ' + delay + ', ' +
                  'box-shadow 0.8s ease ' + delay + ', ' +
                  'opacity 0.8s ease ' + delay,
                  'important');
              });
            }
          }
        }

        html.classList.add('theme-transitioning');
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcons(next);
        setTimeout(function () {
          html.classList.remove('theme-transitioning');
          if (heroEls) {
            heroEls.forEach(function (el) {
              el.style.removeProperty('transition');
            });
          }
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