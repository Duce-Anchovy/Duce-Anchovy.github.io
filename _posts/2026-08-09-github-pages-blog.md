---
title: 使用 GitHub Pages 搭建免费个人博客
date: 2026-08-09
category: 技术教程
accent_color: green
read_time: 8
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(97,175,239,0.05); border: 1px solid rgba(97,175,239,0.12); border-left: 3px solid #61afef;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: rgba(171,178,191,0.8);">
    GitHub Pages 是 GitHub 提供的免费静态网站托管服务，你可以用它来搭建个人博客、项目文档等。只需要一个仓库，几行代码，就能让你的网站上线。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  什么是 GitHub Pages？
</h2>
<p class="mb-5" data-aos="fade-up">
  GitHub Pages 是 GitHub 提供的一项静态网站托管服务。它允许你直接从 GitHub 仓库托管个人、组织或项目页面。你可以使用 HTML、CSS、JavaScript 等前端技术编写网站，然后通过 GitHub Pages 免费发布到互联网上。
</p>
<p class="mb-5" data-aos="fade-up">对于想要搭建个人博客的开发者来说，GitHub Pages 是一个绝佳的选择：</p>
<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>完全免费，无需购买服务器</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>与 Git 工作流无缝集成，写作即提交</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>支持自定义域名</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>自带 HTTPS，安全可靠</span>
  </li>
</ul>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  创建仓库
</h2>
<p class="mb-5" data-aos="fade-up">
  首先，你需要在 GitHub 上创建一个特殊命名的仓库。仓库名必须是 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">你的用户名.github.io</code>。例如，如果你的用户名是 Duce-Anchovy，那么仓库名就是 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">Duce-Anchovy.github.io</code>。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(229,192,123,0.06); border: 1px solid rgba(229,192,123,0.15); border-left: 3px solid #e5c07b;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #e5c07b;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #e5c07b;">小贴士</p>
    <p class="text-[13px] leading-relaxed" style="color: rgba(171,178,191,0.8);">
      仓库名必须严格遵循 <code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">username.github.io</code> 的格式，否则 GitHub Pages 不会自动启用。
    </p>
  </div>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  编写你的第一个页面
</h2>
<p class="mb-5" data-aos="fade-up">
  创建仓库后，你可以直接在 GitHub 网页端添加一个 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">index.html</code> 文件，这将是你博客的首页。
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">index.html</span>
    <i data-lucide="copy" class="w-3.5 h-3.5 cursor-pointer" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;">&lt;!DOCTYPE html&gt;</span>
<span style="color: #e06c75;">&lt;html&gt;</span>
<span style="color: #e06c75;">&lt;head&gt;</span>
  <span style="color: #e06c75;">&lt;title&gt;</span><span style="color: #98c379;">我的博客</span><span style="color: #e06c75;">&lt;/title&gt;</span>
<span style="color: #e06c75;">&lt;/head&gt;</span>
<span style="color: #e06c75;">&lt;body&gt;</span>
  <span style="color: #e06c75;">&lt;h1&gt;</span><span style="color: #e6e6e6;">Hello, World!</span><span style="color: #e06c75;">&lt;/h1&gt;</span>
<span style="color: #e06c75;">&lt;/body&gt;</span>
<span style="color: #e06c75;">&lt;/html&gt;</span></code></pre>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  访问你的博客
</h2>
<p class="mb-5" data-aos="fade-up">
  提交代码后，等待一两分钟让 GitHub 部署完成，你就可以通过浏览器访问 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #d19a66;">https://你的用户名.github.io</code> 来查看你的博客了。
</p>
<p class="mb-5" data-aos="fade-up">
  后续你可以继续探索更多功能，比如使用 Jekyll、Hugo 等静态站点生成器，或者绑定自定义域名。你的数字花园，从此开始生长。
</p>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">如有疑问，欢迎交流</p>
</div>