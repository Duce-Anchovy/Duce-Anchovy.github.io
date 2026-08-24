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

    // 立即切换主题：前景颜色通过 .theme-transitioning 平滑过渡
    function applyTheme(next) {
      html.classList.add('theme-transitioning');
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcons(next);
      setTimeout(function () {
        html.classList.remove('theme-transitioning');
      }, 1200);
    }

    // 返回指定主题的 body 背景渐变（与 style.css 保持一致）
    function bgFor(theme) {
      if (theme === 'dark') {
        return 'linear-gradient(135deg, rgba(15,25,45,1) 0%, rgba(25,18,40,1) 30%, rgba(10,15,24,1) 50%, rgba(12,28,36,1) 75%, rgba(15,25,45,1) 100%)';
      }
      return 'radial-gradient(at 15% 25%, rgba(219,234,254,0.45) 0%, transparent 55%), radial-gradient(at 80% 15%, rgba(237,233,254,0.45) 0%, transparent 55%), radial-gradient(at 45% 70%, rgba(207,250,254,0.40) 0%, transparent 55%), radial-gradient(at 75% 80%, rgba(219,234,254,0.35) 0%, transparent 55%), #f0f2f5';
    }

    // 主页：overlay 盖住"旧背景"，向左滑出露出新背景，从右往左扫过
    function sweepOldBackground(oldTheme) {
      var overlay = document.createElement('div');
      overlay.className = 'fx-sweep-overlay';
      overlay.style.background = bgFor(oldTheme);
      overlay.style.backgroundSize = oldTheme === 'dark' ? '400% 400%' : '200% 200%';
      // 插入到粒子 canvas 之前，让粒子光效浮在扫过层之上
      var particles = document.getElementById('fx-particles');
      if (particles && particles.parentNode) {
        particles.parentNode.insertBefore(overlay, particles);
      } else {
        document.body.appendChild(overlay);
      }
      requestAnimationFrame(function () {
        overlay.classList.add('sweep-active');
      });
      var removed = false;
      function removeOverlay() {
        if (removed) return;
        removed = true;
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
      overlay.addEventListener('animationend', removeOverlay);
      setTimeout(removeOverlay, 1100);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        var isHome = html.getAttribute('data-page') === 'home';

        if (isHome) {
          // 先盖旧背景层，再立即切换主题（前景平滑过渡），旧背景层向左滑出露出新背景
          sweepOldBackground(current);
          applyTheme(next);
        } else {
          applyTheme(next);
        }
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
     7.5 文章分类筛选（首页）
     依赖：文章卡片带 data-category，Tabs 带 data-filter
     ======================================== */
  function initCategoryFilter() {
    var searchInput = document.getElementById('post-search');
    var filterBtn = document.getElementById('filter-btn');
    var modal = document.getElementById('tag-modal');
    var mask = document.getElementById('tag-modal-mask');
    var closeBtn = document.getElementById('tag-modal-close');
    var applyBtn = document.getElementById('tag-apply');
    var tagOptions = document.querySelectorAll('.fx-tag-option');
    var orderOptions = document.querySelectorAll('.fx-order-option');
    var cards = document.querySelectorAll('#posts .space-y-1 > a');
    if (!cards.length) return;

    var activeTags = [];
    var sortOrder = null; // null = 自动：无搜索按时间顺序，有搜索按相关性

    function hasQuery() {
      return !!(searchInput && searchInput.value.trim());
    }
    function effectiveOrder() {
      if (sortOrder) return sortOrder;
      return hasQuery() ? 'relevance' : 'newest';
    }

    function applyFilter() {
      var q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      var container = cards[0].parentNode;
      var order = effectiveOrder();
      var visible = [];
      cards.forEach(function (c) {
        var cat = c.getAttribute('data-category') || 'all';
        var tagOk = activeTags.length === 0 || activeTags.indexOf('all') !== -1 || activeTags.indexOf(cat) !== -1;
        if (!tagOk) {
          c.style.display = 'none';
          return;
        }
        var score = 0;
        if (q) {
          var text = (c.textContent || '').toLowerCase();
          var titleEl = c.querySelector('h3');
          var title = titleEl ? (titleEl.textContent || '').toLowerCase() : '';
          var hitCount = 0;
          var titleHits = 0;
          var i, ch;
          for (i = 0; i < q.length; i++) {
            ch = q.charAt(i);
            if (ch === ' ' || ch === '　') continue;
            if (text.indexOf(ch) !== -1) hitCount++;
            if (title.indexOf(ch) !== -1) titleHits++;
          }
          if (hitCount === 0) {
            // 无单字命中：隐藏
            c.style.display = 'none';
            return;
          }
          if (text.indexOf(q) !== -1) score += 1000; // 完整连续片段命中：相似度最高
          score += hitCount * 20;                     // 命中单字越多越靠前
          score += titleHits * 10;                    // 标题命中加成
        }
        c.style.display = '';
        visible.push({ el: c, score: score });
      });
      if (order === 'oldest') {
        visible.reverse();
      } else if (order === 'relevance' && q) {
        visible.sort(function (a, b) { return b.score - a.score; });
      }
      // newest（或相关性且无搜索词时）保持原时间顺序
      visible.forEach(function (item) { container.appendChild(item.el); });
      if (filterBtn) {
        filterBtn.classList.toggle('is-active', activeTags.length > 0);
      }
      if (typeof AOS !== 'undefined' && AOS.refresh) AOS.refresh();
    }

    function openModal() {
      tagOptions.forEach(function (o) {
        var tag = o.getAttribute('data-tag');
        o.classList.toggle('is-active', activeTags.indexOf(tag) !== -1);
      });
      var cur = effectiveOrder();
      orderOptions.forEach(function (o) {
        o.classList.toggle('is-active', o.getAttribute('data-order') === cur);
      });
      if (modal) modal.hidden = false;
    }
    function closeModal() {
      if (modal) modal.hidden = true;
    }

    if (searchInput) searchInput.addEventListener('input', applyFilter);
    if (filterBtn) filterBtn.addEventListener('click', openModal);
    if (mask) mask.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (applyBtn) applyBtn.addEventListener('click', function () {
      activeTags = [];
      tagOptions.forEach(function (o) {
        if (o.classList.contains('is-active')) {
          activeTags.push(o.getAttribute('data-tag'));
        }
      });
      sortOrder = null;
      orderOptions.forEach(function (o) {
        if (o.classList.contains('is-active')) {
          sortOrder = o.getAttribute('data-order');
        }
      });
      closeModal();
      applyFilter();
    });
    tagOptions.forEach(function (o) {
      o.addEventListener('click', function () {
        var tag = o.getAttribute('data-tag');
        if (tag === 'all') {
          // 全部与其它选项互斥：选中全部时取消其它所有
          if (o.classList.contains('is-active')) {
            o.classList.remove('is-active'); // 再次点击全部 = 取消筛选
          } else {
            o.classList.add('is-active');
            tagOptions.forEach(function (x) {
              if (x.getAttribute('data-tag') !== 'all') x.classList.remove('is-active');
            });
          }
        } else {
          // 选中其它选项时取消"全部"
          o.classList.toggle('is-active');
          tagOptions.forEach(function (x) {
            if (x.getAttribute('data-tag') === 'all') x.classList.remove('is-active');
          });
        }
      });
    });
    orderOptions.forEach(function (o) {
      o.addEventListener('click', function () {
        orderOptions.forEach(function (x) {
          x.classList.toggle('is-active', x === o);
        });
      });
    });
    applyFilter();
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
    initCategoryFilter();
    initCardDates();
  });
})();