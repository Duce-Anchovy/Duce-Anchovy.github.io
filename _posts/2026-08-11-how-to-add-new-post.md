---
layout: post
title: 如何为本站新增一篇文章
date: 2026-08-11
category: 网站相关
accent_color: blue
read_time: 5
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(97,175,239,0.05); border: 1px solid rgba(97,175,239,0.12); border-left: 3px solid #61afef;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    本站已迁移至 Jekyll 模板系统，新增文章只需编写 Markdown 内容，无需重复搭建页面结构。本文是一份手把手的操作指南。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  了解项目结构
</h2>
<p class="mb-5" data-aos="fade-up">
  先看一眼项目的目录结构，理解每个文件的作用：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">项目结构</span>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;">duce-anchovy-blog/</span>
<span style="color: #5c6370;">├── _config.yml          ← Jekyll 配置，无需修改</span>
<span style="color: #5c6370;">├── _layouts/</span>
<span style="color: #5c6370;">│   └── post.html        ← 文章页模板，无需修改</span>
<span style="color: #5c6370;">├── _posts/              ← ★ 文章放这里</span>
<span style="color: #5c6370;">│   ├── 2026-08-06-web-dev-learning-path.md</span>
<span style="color: #5c6370;">│   ├── 2026-08-08-markdown-writing-guide.md</span>
<span style="color: #5c6370;">│   └── 2026-08-09-github-pages-blog.md</span>
<span style="color: #5c6370;">├── index.html           ← 首页，需手动添加文章链接</span>
<span style="color: #5c6370;">├── fx-animations.css</span>
<span style="color: #5c6370;">├── fx-animations.js</span>
<span style="color: #5c6370;">└── img/                 ← 图片资源</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  核心概念：<strong>模板负责壳，文章负责内容</strong>。<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">_layouts/post.html</code> 已经包含了导航栏、主题切换、页脚等一切公共结构，你只需要关心文章正文。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  第一步：创建 Markdown 文件
</h2>
<p class="mb-5" data-aos="fade-up">
  在 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">_posts/</code> 目录下新建一个文件，命名规则为：
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(229,192,123,0.06); border: 1px solid rgba(229,192,123,0.15); border-left: 3px solid #e5c07b;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #e5c07b;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #e5c07b;">命名规则</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">YYYY-MM-DD-英文短标题.md</code><br/>
      例如：<code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">2026-08-15-my-ai-workflow.md</code>
    </p>
  </div>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  第二步：编写 YAML Front Matter
</h2>
<p class="mb-5" data-aos="fade-up">
  文件开头必须包含 YAML 元数据，用 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">---</code> 包裹。这是 Jekyll 识别文章信息的方式：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">2026-08-15-my-ai-workflow.md</span>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #c678dd;">---</span>
<span style="color: #d19a66;">title</span>: <span style="color: #98c379;">我的 AI 工作流分享</span>
<span style="color: #d19a66;">date</span>: <span style="color: #98c379;">2026-08-15</span>
<span style="color: #d19a66;">category</span>: <span style="color: #98c379;">AI 应用</span>
<span style="color: #d19a66;">accent_color</span>: <span style="color: #98c379;">blue</span>
<span style="color: #d19a66;">read_time</span>: <span style="color: #98c379;">8</span>
<span style="color: #c678dd;">---</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">各字段说明：</p>
<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>title</strong>：文章标题，会显示在页面顶部和浏览器标签栏</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>date</strong>：发布日期，格式为 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">YYYY-MM-DD</code></span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>category</strong>：分类名，显示在日期旁边</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>accent_color</strong>：分类标签的颜色，可选 green / blue / purple / cyan / orange / red</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>read_time</strong>：预估阅读时长（分钟），数字即可</span>
  </li>
</ul>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  第三步：编写正文（HTML）
</h2>
<p class="mb-5" data-aos="fade-up">
  Front Matter 之后直接写 HTML 正文。你不需要写 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;html&gt;</code>、<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;head&gt;</code>、<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;body&gt;</code> 这些结构标签——模板会自动包裹。你只需要写文章内容区的 HTML。
</p>
<p class="mb-5" data-aos="fade-up">以下是一份完整的文章骨架，可以直接复制使用：</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">完整模板</span>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #c678dd;">---</span>
<span style="color: #d19a66;">title</span>: <span style="color: #98c379;">我的 AI 工作流分享</span>
<span style="color: #d19a66;">date</span>: <span style="color: #98c379;">2026-08-15</span>
<span style="color: #d19a66;">category</span>: <span style="color: #98c379;">AI 应用</span>
<span style="color: #d19a66;">accent_color</span>: <span style="color: #98c379;">blue</span>
<span style="color: #d19a66;">read_time</span>: <span style="color: #98c379;">8</span>
<span style="color: #c678dd;">---</span>

<span style="color: #5c6370;">&lt;!-- 引言框 --&gt;</span>
<span style="color: #5c6370;">&lt;div class="mb-8 p-5 rounded-xl"</span>
<span style="color: #5c6370;">     style="background: rgba(97,175,239,0.05);</span>
<span style="color: #5c6370;">            border: 1px solid rgba(97,175,239,0.12);</span>
<span style="color: #5c6370;">            border-left: 3px solid #61afef;"</span>
<span style="color: #5c6370;">     data-aos="fade-up"&gt;</span>
<span style="color: #5c6370;">  &lt;p class="text-[14px] leading-relaxed italic"</span>
<span style="color: #5c6370;">     style="color: var(--fg-subtle);"&gt;</span>
<span style="color: #5c6370;">    一段引人入胜的开场白，概括文章主题。</span>
<span style="color: #5c6370;">  &lt;/p&gt;</span>
<span style="color: #5c6370;">&lt;/div&gt;</span>

<span style="color: #5c6370;">&lt;!-- 小标题 + 编号 --&gt;</span>
<span style="color: #5c6370;">&lt;h2 class="text-[22px] font-bold mt-12 mb-4</span>
<span style="color: #5c6370;">           flex items-center gap-3"</span>
<span style="color: #5c6370;">    style="color: var(--fg-bright);"</span>
<span style="color: #5c6370;">    data-aos="fade-up"&gt;</span>
<span style="color: #5c6370;">  &lt;span class="w-6 h-6 rounded-md ..."&gt;1&lt;/span&gt;</span>
<span style="color: #5c6370;">  第一个章节标题</span>
<span style="color: #5c6370;">&lt;/h2&gt;</span>

<span style="color: #5c6370;">&lt;!-- 正文段落 --&gt;</span>
<span style="color: #5c6370;">&lt;p class="mb-5" data-aos="fade-up"&gt;</span>
<span style="color: #5c6370;">  正文内容……</span>
<span style="color: #5c6370;">&lt;/p&gt;</span>

<span style="color: #5c6370;">&lt;!-- 结尾 --&gt;</span>
<span style="color: #5c6370;">&lt;div class="mt-14 pt-8 text-center"</span>
<span style="color: #5c6370;">     style="border-top: 1px dashed rgba(62,68,81,0.6);"</span>
<span style="color: #5c6370;">     data-aos="fade-up"&gt;</span>
<span style="color: #5c6370;">  &lt;p class="text-[13px] italic mb-2"</span>
<span style="color: #5c6370;">     style="color: #c678dd;"&gt;感谢阅读&lt;/p&gt;</span>
<span style="color: #5c6370;">&lt;/div&gt;</span></code></pre>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  第四步：在首页添加链接
</h2>
<p class="mb-5" data-aos="fade-up">
  打开 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">index.html</code>，在文章列表区（<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;div class="space-y-1"&gt;</code> 内）添加一个新卡片。复制已有的卡片代码块，修改三个地方：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">新增卡片示例</span>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;">&lt;!-- 文章4 --&gt;</span>
<span style="color: #5c6370;">&lt;a href="/posts/how-to-add-new-post/"</span>
<span style="color: #5c6370;">   class="fx-card-3d fx-card-glow group block p-5</span>
<span style="color: #5c6370;">          -mx-2 rounded-xl transition-all duration-300"</span>
<span style="color: #5c6370;">   style="border: 1px solid transparent;"</span>
<span style="color: #5c6370;">   data-aos="fade-up" data-aos-delay="100"&gt;</span>
<span style="color: #5c6370;">  &lt;div class="flex items-baseline justify-between"&gt;</span>
<span style="color: #5c6370;">    &lt;h3&gt;文章标题&lt;/h3&gt;</span>
<span style="color: #5c6370;">    &lt;time&gt;8月11日&lt;/time&gt;</span>
<span style="color: #5c6370;">  &lt;/div&gt;</span>
<span style="color: #5c6370;">  &lt;p&gt;文章摘要……&lt;/p&gt;</span>
<span style="color: #5c6370;">  &lt;div&gt;</span>
<span style="color: #5c6370;">    &lt;span&gt;分类标签&lt;/span&gt;</span>
<span style="color: #5c6370;">  &lt;/div&gt;</span>
<span style="color: #5c6370;">&lt;/a&gt;</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">需要修改的三个关键点：</p>
<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>链接地址</strong>：<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">href="/posts/文件名中的-slug/"</code>（注意前后斜杠）</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>标题和日期</strong>：<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;h3&gt;</code> 和 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">&lt;time&gt;</code> 中的文字</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
    <span><strong>分类标签</strong>：颜色和文字，参考现有标签的 CSS 变量（<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">--tag-blue-bg</code>、<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">--blue</code> 等）</span>
  </li>
</ul>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  第五步：推送上线
</h2>
<p class="mb-5" data-aos="fade-up">
  完成以上两步后，在项目根目录执行三条 Git 命令：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">终端</span>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;">git add _posts/ index.html</span>
<span style="color: #5c6370;">git commit -m "新增文章：我的 AI 工作流分享"</span>
<span style="color: #5c6370;">git push</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  推送后 GitHub Pages 会自动运行 Jekyll 构建，通常 1-2 分钟内即可在 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">https://duce-anchovy.github.io</code> 看到新文章。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(86,182,194,0.06); border: 1px solid rgba(86,182,194,0.15); border-left: 3px solid #56b6c2;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #56b6c2;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #56b6c2;">常用标签颜色速查</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      绿色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">green</code>（技术教程） ·
      紫色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">purple</code>（写作方法） ·
      蓝色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">blue</code>（AI 应用 / 站点维护） ·
      橙色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">orange</code>（学习路线） ·
      青色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">cyan</code>（工具推荐） ·
      红色 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">red</code>（项目实战）
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">现在你已经掌握了全部流程</p>
  <p class="text-[12px]" style="color: #4b5263;">去写你的下一篇吧</p>
</div>