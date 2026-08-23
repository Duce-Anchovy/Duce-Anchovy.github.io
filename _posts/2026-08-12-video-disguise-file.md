---
layout: post
title: 视频伪装文件：把压缩包藏进视频里的原理与制作方法
date: 2026-08-12
category: 小技术
accent_color: purple
read_time: 8
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    你下载了一个看似普通的 .mp4 视频，打开后正常播放。但当你把后缀名改成 .zip 再解压，里面竟然藏着另一个世界——这听起来像间谍电影里的桥段，但实现原理比你想象的要简单得多。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>把压缩包数据直接拼接到视频文件末尾。视频播放器从文件头开始解析，发现多余数据自动忽略；解压软件从文件尾开始定位，找到压缩包结构照常解压。两者互不干扰。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  核心原理：文件格式的非对称解析
</h2>

<p class="mb-5" data-aos="fade-up">
  这个技巧之所以有效，关键在于两种文件格式的解析逻辑恰好互补。
</p>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">视频文件（MP4 / AVI / MKV）</h3>

<p class="mb-5" data-aos="fade-up">
  视频文件的数据结构是<strong>从头到尾线性解析</strong>的。文件开头是元数据（文件头），包含编码格式、分辨率、帧率、音轨信息等。播放器读取文件头后，按索引逐帧解码视频流和音频流，直到<strong>到达视频数据结束标记就停止</strong>。
</p>

<p class="mb-5" data-aos="fade-up">
  关键点：播放器不会扫描文件末尾。只要文件头完整、数据流正确，后面多出来的任何字节都会被忽略。
</p>

<div class="my-8 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <pre class="text-[12px] leading-relaxed font-mono m-0" style="color: var(--fg-subtle);">
┌─────────────────────────────────────────────────┐
│  MP4 文件结构                                    │
├──────────┬──────────────────┬───────────────────┤
│  文件头   │     视频/音频数据   │  ← 播放器读到这停止 │
│ (ftyp+   │   (mdat + moov)   │                   │
│  moov)   │                   │                   │
├──────────┴──────────────────┴───────────────────┤
│              ← 这里之后的内容，播放器不管            │
└─────────────────────────────────────────────────┘</pre>
</div>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">压缩包文件（ZIP / RAR / 7z）</h3>

<p class="mb-5" data-aos="fade-up">
  压缩包的结构恰好相反：它的<strong>目录索引在文件末尾</strong>。以 ZIP 为例，解压软件打开文件时，首先<strong>从文件末尾向前搜索</strong>，找到 EOCD（End of Central Directory，中央目录结束标记），然后根据 EOCD 中的偏移量定位到中央目录，再逐一解压出文件。
</p>

<div class="my-8 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <pre class="text-[12px] leading-relaxed font-mono m-0" style="color: var(--fg-subtle);">
┌────────────────────────────────────────────────────┐
│  ZIP 文件结构                                       │
├──────────────┬──────────────────┬──────────────────┤
│  本地文件头1   │   本地文件头2 ...  │  中央目录 + EOCD  │
│  + 压缩数据1   │   + 压缩数据2     │  ← 解压软件从这找  │
├──────────────┴──────────────────┴──────────────────┤
│                                                     │
│  ↑ 前面的内容是什么，解压软件不关心                      │
└────────────────────────────────────────────────────┘</pre>
</div>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">拼接后的效果</h3>

<p class="mb-5" data-aos="fade-up">
  当把视频文件放在前面、压缩包拼在后面，得到的混合文件对两种软件来说都是合法的：
</p>

<div class="my-8 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <pre class="text-[12px] leading-relaxed font-mono m-0" style="color: var(--fg-subtle);">
┌──────────────────────────────────────────────────────────┐
│  伪装文件 = 视频数据 + 压缩包数据                            │
├──────────────────────┬───────────────────────────────────┤
│   MP4 文件头 + 数据流   │  ZIP 本地文件头 + 压缩数据 + 中央目录   │
│                      │                                   │
│  ▲ 播放器看到这里       │  ▲ 解压软件从末尾反向找到这里            │
│    正常播放视频          │    正常解压文件                      │
└──────────────────────┴───────────────────────────────────┘</pre>
</div>

<p class="mb-5" data-aos="fade-up">
  这就是核心原理：<strong>利用两种文件格式解析起点的不同，让同一段二进制数据被两个程序分别解读为不同的合法文件。</strong>这不是加密，也不是漏洞，而是一种基于文件格式特性的数据拼接技巧。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  制作方法
</h2>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">Windows 命令行（最简单）</h3>

<p class="mb-5" data-aos="fade-up">
  Windows 的 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">copy /b</code> 命令可以直接以二进制模式拼接文件：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">Windows CMD</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #e5c07b;">copy /b</span> <span style="color: #98c379;">video.mp4</span> + <span style="color: #e06c75;">secret.zip</span> <span style="color: #98c379;">output.mp4</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">参数说明：</p>

<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span><code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">/b</code>：以二进制模式处理，不添加任何结束标记，原样拼接</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span><code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">video.mp4</code>：载体视频文件（放在前面）</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span><code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">secret.zip</code>：要隐藏的压缩包（放在后面）</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span><code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">output.mp4</code>：生成的伪装文件，后缀名保持 .mp4</span>
  </li>
</ul>

<p class="mb-5" data-aos="fade-up">
  生成的 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e5c07b;">output.mp4</code> 可以直接用任何播放器打开，播放正常的视频内容。文件大小 = 视频大小 + 压缩包大小。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="info" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">提示</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      如果视频文件是 .mkv 或 .avi 格式，原理相同，只需把文件名替换即可。但 .mp4 兼容性最好，推荐作为首选载体。
    </p>
  </div>
</div>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">macOS / Linux 终端</h3>

<p class="mb-5" data-aos="fade-up">
  使用 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">cat</code> 命令拼接：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">macOS / Linux Terminal</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #e5c07b;">cat</span> <span style="color: #98c379;">video.mp4</span> <span style="color: #e06c75;">secret.zip</span> <span style="color: #c678dd;">&gt;</span> <span style="color: #98c379;">output.mp4</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">&gt;</code> 将拼接后的输出重定向到新文件，不改变原始文件。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  解压方式
</h2>

<p class="mb-5" data-aos="fade-up">
  解压也有多种方式，根据不同场景选择。
</p>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">方式一：直接改后缀名解压</h3>

<p class="mb-5" data-aos="fade-up">
  最直接的方法：将伪装文件的后缀名从 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">.mp4</code> 改为 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">.zip</code>，然后用解压软件打开。
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">Windows CMD</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #e5c07b;">ren</span> <span style="color: #98c379;">output.mp4</span> <span style="color: #98c379;">output.zip</span>
<span style="color: #5c6370;"># 然后用 WinRAR / 7-Zip / 系统自带解压打开 output.zip</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  解压软件在打开时会从文件末尾搜索 EOCD 标记，找到后正常解析出压缩包内容。前面的视频数据会被当作无效数据忽略。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(97,175,239,0.06); border: 1px solid rgba(97,175,239,0.15); border-left: 3px solid #61afef;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #61afef;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #61afef;">原理说明</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      ZIP 格式的 EOCD 记录位于文件末尾，包含中央目录的偏移量和大小。解压软件打开 .zip 文件时，会从文件末尾倒着搜索 EOCD 签名（<code class="px-1 rounded text-[12px] font-mono" style="background: rgba(0,0,0,0.2); color: #d19a66;">0x06054b50</code>），找到后根据其中的偏移量跳转到中央目录。因此，不管文件前面有多少无关数据，只要末尾的 ZIP 结构完整，就能正常解压。
    </p>
  </div>
</div>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">方式二：用 7-Zip / WinRAR 直接打开</h3>

<p class="mb-5" data-aos="fade-up">
  7-Zip 和 WinRAR 都支持直接打开非标准后缀名的压缩包。无需改后缀名：
</p>

<ol class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <span class="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5" style="background: #21252b; color: #61afef;">1</span>
    <span>打开 7-Zip 或 WinRAR</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5" style="background: #21252b; color: #61afef;">2</span>
    <span>在软件内导航到伪装文件所在目录</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5" style="background: #21252b; color: #61afef;">3</span>
    <span>右键点击 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">output.mp4</code> → 选择"用 7-Zip 打开"或"打开压缩包"</span>
  </li>
  <li class="flex items-start gap-3">
    <span class="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5" style="background: #21252b; color: #61afef;">4</span>
    <span>软件会自动识别文件末尾的压缩包结构并列出内容</span>
  </li>
</ol>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">方式三：命令行解压</h3>

<p class="mb-5" data-aos="fade-up">
  使用 7-Zip 命令行工具，无需改后缀名：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">Terminal</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;"># 列出压缩包内容</span>
<span style="color: #e5c07b;">7z l</span> <span style="color: #98c379;">output.mp4</span>

<span style="color: #5c6370;"># 解压到当前目录</span>
<span style="color: #e5c07b;">7z x</span> <span style="color: #98c379;">output.mp4</span> <span style="color: #c678dd;">-o</span><span style="color: #e5c07b;">./extracted</span></code></pre>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  进阶技巧与注意事项
</h2>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">增加隐蔽性：选择合适的视频</h3>

<p class="mb-5" data-aos="fade-up">
  文件大小是最大的破绽。一个 10 分钟的 1080p 视频通常在 100MB–300MB 之间，如果伪装文件高达 2GB，会显得异常。建议：
</p>

<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>控制压缩包大小，使总文件体积在合理范围内</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>选择时长和分辨率匹配视频体积的内容</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #98c379;"></i>
    <span>如果有多个大文件，可以拆分成多个伪装文件</span>
  </li>
</ul>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">使用加密压缩包</h3>

<p class="mb-5" data-aos="fade-up">
  在制作伪装文件之前，先对压缩包设置密码：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">Terminal</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;"># 7-Zip 命令行加密压缩</span>
<span style="color: #e5c07b;">7z a</span> <span style="color: #c678dd;">-p</span><span style="color: #e06c75;">YourPassword</span> <span style="color: #c678dd;">-mhe=on</span> <span style="color: #98c379;">secret.7z</span> <span style="color: #e5c07b;">folder_to_hide/</span>

<span style="color: #5c6370;"># 然后拼接</span>
<span style="color: #e5c07b;">copy /b</span> <span style="color: #98c379;">video.mp4</span> + <span style="color: #98c379;">secret.7z</span> <span style="color: #98c379;">output.mp4</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e06c75;">-mhe=on</code> 参数会加密文件列表，不解压看不到里面有什么文件。
</p>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">格式兼容性</h3>

<p class="mb-5" data-aos="fade-up">
  不是所有视频格式的容错性都一样好：
</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">载体格式</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">兼容性</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">说明</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>MP4</strong></td>
        <td class="py-2.5 px-4"><span style="color: var(--green);">最佳</span></td>
        <td class="py-2.5 px-4">几乎所有播放器都支持尾部附加数据，兼容性最好</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>AVI</strong></td>
        <td class="py-2.5 px-4"><span style="color: var(--green);">良好</span></td>
        <td class="py-2.5 px-4">多数播放器兼容，但部分老旧播放器可能报错</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>MKV</strong></td>
        <td class="py-2.5 px-4"><span style="color: var(--orange);">一般</span></td>
        <td class="py-2.5 px-4">部分播放器会尝试解析尾部数据，可能导致播放异常</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>MOV</strong></td>
        <td class="py-2.5 px-4"><span style="color: var(--orange);">一般</span></td>
        <td class="py-2.5 px-4">QuickTime 对尾部数据比较敏感，可能播放失败</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>FLV</strong></td>
        <td class="py-2.5 px-4"><span style="color: var(--red);">不推荐</span></td>
        <td class="py-2.5 px-4">结构对尾部数据敏感，容易导致播放失败</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 class="text-[17px] font-semibold mt-8 mb-3" style="color: var(--fg-bright);" data-aos="fade-up">压缩包格式选择</h3>

<p class="mb-5" data-aos="fade-up">
  ZIP 是最通用的选择，因为它的目录结构在文件末尾，几乎所有解压软件都支持。RAR 和 7z 也可以，但 ZIP 兼容性最好。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  一个完整的示例
</h2>

<p class="mb-5" data-aos="fade-up">
  假设你有一个 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e5c07b;">demo.mp4</code>（100MB）和一个要隐藏的文件夹 <code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e5c07b;">hidden_files</code>：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">完整流程</span>
    <i data-lucide="terminal" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #5c6370;"># 步骤1：将文件夹压缩为加密 ZIP</span>
<span style="color: #e5c07b;">7z a</span> <span style="color: #c678dd;">-tzip</span> <span style="color: #c678dd;">-p</span><span style="color: #e06c75;">MySecret123</span> <span style="color: #98c379;">secret.zip</span> <span style="color: #e5c07b;">hidden_files/</span>

<span style="color: #5c6370;"># 步骤2：拼接视频和压缩包</span>
<span style="color: #e5c07b;">copy /b</span> <span style="color: #98c379;">demo.mp4</span> + <span style="color: #98c379;">secret.zip</span> <span style="color: #98c379;">disguised.mp4</span>

<span style="color: #5c6370;"># 步骤3：验证——用播放器打开 disguised.mp4，正常播放</span>

<span style="color: #5c6370;"># 步骤4：解压——改后缀名后解压</span>
<span style="color: #e5c07b;">ren</span> <span style="color: #98c379;">disguised.mp4</span> <span style="color: #98c379;">disguised.zip</span>
<span style="color: #5c6370;"># 用解压软件打开 disguised.zip，输入密码 MySecret123</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  完成后，<code class="px-1.5 py-0.5 rounded text-[13px] font-mono" style="background: #21252b; color: #e5c07b;">disguised.mp4</code> 看起来就是一个普通的视频文件，但其中隐藏了你的加密压缩包。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  原理总结
</h2>

<div class="my-8 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="mb-4" style="color: var(--fg);">
    这个技巧的本质是<strong>利用文件格式解析的容错性</strong>：
  </p>
  <ul class="mb-0 space-y-2.5 pl-1" style="list-style: none;">
    <li class="flex items-start gap-3">
      <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
      <span>视频播放器<strong>从文件头开始、线性解析</strong>，遇到视频数据结束就停止，对尾部额外数据熟视无睹</span>
    </li>
    <li class="flex items-start gap-3">
      <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #61afef;"></i>
      <span>解压软件<strong>从文件尾开始、反向搜索</strong>，找到压缩包结构后直接定位，前面的视频数据形同虚设</span>
    </li>
    <li class="flex items-start gap-3">
      <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #56b6c2;"></i>
      <span>两者解析的"起点"和"方向"不同，在同一段数据中各取所需、互不干扰</span>
    </li>
  </ul>
</div>

<p class="mb-5" data-aos="fade-up">
  这不是加密技术，更不是安全漏洞。它只是一种基于文件格式特性的数据拼接方法。如果你需要真正的隐蔽通信，应该使用专业的隐写术（Steganography）工具和端到端加密方案。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(224,108,117,0.06); border: 1px solid rgba(224,108,117,0.15); border-left: 3px solid #e06c75;" data-aos="fade-up">
  <i data-lucide="alert-triangle" class="w-5 h-5 shrink-0 mt-0.5" style="color: #e06c75;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #e06c75;">声明</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      本文仅介绍技术原理，请遵守当地法律法规，不要将本技术用于非法用途。在受监管的网络环境中，此类文件的异常大小和结构特征可能被安全软件检测到。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">如有疑问，欢迎交流</p>
</div>