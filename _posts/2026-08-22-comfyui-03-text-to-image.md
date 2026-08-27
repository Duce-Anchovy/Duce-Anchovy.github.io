---
layout: post
title: ComfyUI 从零学习（三）：文生图基础链路
date: 2026-08-22
category: AI 绘画
accent_color: purple
read_time: 8
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    前两篇我们把界面摸熟了，但对「一条能出图的链路长什么样」还只停留在想象。本篇是全系列最重要的一篇：从零搭出第一条文生图链路，逐节点拆解每个方块在后台到底做了什么，并亲手完成一次出图。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>文生图就是把「文字描述」经文本编码、潜空间采样、像素解码三个环节，变成一张图片；ComfyUI 把这套流程拆成七个看得见的节点。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  3.1 一条完整链路长什么样
</h2>

<p class="mb-5" data-aos="fade-up">
  标准文生图工作流通常由七个节点组成。先看整体，再逐个进入：
</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">节点</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">职责</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">输出</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4">Checkpoint Loader</td>
        <td class="py-2.5 px-4">加载大模型，同时给出三条能力</td>
        <td class="py-2.5 px-4">MODEL / CLIP / VAE</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4">CLIP Text Encode ×2</td>
        <td class="py-2.5 px-4">把提示词变成条件数据</td>
        <td class="py-2.5 px-4">CONDITIONING</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4">Empty Latent Image</td>
        <td class="py-2.5 px-4">设定画布尺寸，生成空白潜空间</td>
        <td class="py-2.5 px-4">LATENT</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4">KSampler</td>
        <td class="py-2.5 px-4">核心采样，从噪声中一步步长出图像</td>
        <td class="py-2.5 px-4">LATENT</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4">VAE Decode</td>
        <td class="py-2.5 px-4">把潜空间数据翻译回真实像素</td>
        <td class="py-2.5 px-4">IMAGE</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4">Save Image</td>
        <td class="py-2.5 px-4">保存并显示最终图片</td>
        <td class="py-2.5 px-4">无</td>
      </tr>
    </tbody>
  </table>
</div>

<p class="mb-5" data-aos="fade-up">
  数据流的方向很清楚：模型三条能力分头接向对应节点，提示词和画布一起喂给采样器，采样结果解码成图、保存落地。把这七块连好，一条能出图的链路就成了。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  3.2 加载大模型：Checkpoint Loader
</h2>

<p class="mb-5" data-aos="fade-up">
  一个 Checkpoint 文件里其实打包了三种能力：模型本体（MODEL）、文本编码器（CLIP）、像素解码器（VAE）。所以加载器节点会同时吐出三条线，分别接给后面的采样、提示词编码和解码环节。在节点上点一下，就能在模型列表里切换不同的 Checkpoint。
</p>

<p class="mb-5" data-aos="fade-up">
  换模型等于换「画师」：同一个提示词，在不同 Checkpoint 下画风和品质差异可能很大。这也是为什么大家常说「出图效果主要看模型」——它决定了整条链路的上限。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  3.3 把文字变成机器指令：CLIP Text Encode
</h2>

<p class="mb-5" data-aos="fade-up">
  采样器听不懂中文或英文，它只认识数字。CLIP Text Encode 节点负责把提示词翻译成机器能用的条件数据（CONDITIONING），作为采样方向的「指令书」。
</p>

<p class="mb-5" data-aos="fade-up">
  标准链路里通常有两个这样的节点：一个写「正面提示词」，描述你想要的画面；一个写「负面提示词」，列出你不想要的元素。两者一起输入采样器，正面负责拉、负面负责推，合力把结果稳定在想要的区域。别把条件数据想复杂，记住它是「一份带语义的指令」就够了。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  3.4 设定画布：Empty Latent Image
</h2>

<p class="mb-5" data-aos="fade-up">
  这个节点用来设定输出图的尺寸，常见参数是宽度、高度和批量数。它的输出不是一张空白像素图，而是一个「空白潜空间」——一块装满了随机噪声、尺寸对应的画布，采样器会在这上面作画。
</p>

<p class="mb-5" data-aos="fade-up">
  理解潜空间很重要。模型并不直接在像素层面工作，而是先把图像压缩到一个更小的、高效的表征空间里处理，这个空间就叫潜空间（Latent）。分辨率越高，潜空间张量越大，显存占用也越高——这就是为什么大图更吃显存。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  3.5 采样器 KSampler：图片从这里「长」出来
</h2>

<p class="mb-5" data-aos="fade-up">
  KSampler 是全链路的心脏。它接收正面条件、负面条件、潜空间画布和模型，然后按你设定的步数，从噪声里一步步「长」出一张图像数据。它身上有五个关键旋钮，这里先讲清楚它们各自管什么，具体怎么调留给第五篇：
</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">参数</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">管什么</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>seed</strong></td>
        <td class="py-2.5 px-4">随机种子，决定初始噪声。固定它，结果可复现</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>steps</strong></td>
        <td class="py-2.5 px-4">采样步数，迭代精化的次数，越大越细致但越慢</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>cfg</strong></td>
        <td class="py-2.5 px-4">提示词服从度，越大越贴近描述，过高容易崩</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>sampler</strong></td>
        <td class="py-2.5 px-4">采样器算法，决定每步怎么走（euler / dpmpp 等）</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>scheduler</strong></td>
        <td class="py-2.5 px-4">调度器，控制噪声随时间衰减的节奏</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  3.6 潜空间与像素互转：VAE Decode
</h2>

<p class="mb-5" data-aos="fade-up">
  采样器输出的是潜空间数据，它不是我们眼睛能看的图片。VAE Decode 节点负责把潜空间翻译回真实的像素图像（IMAGE）。没有这一步，你就只能看到一团抽象的数据，而不是一张画。
</p>

<p class="mb-5" data-aos="fade-up">
  反过来，当你想用现有图片做图生图时，需要 VAE Encode 把像素压回潜空间——这是下一篇的内容。一解一编，一进一出，VAE 就是潜空间和真实世界之间的「翻译官」。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">7</span>
  3.7 保存：Save Image
</h2>

<p class="mb-5" data-aos="fade-up">
  最后一个节点把生成的图像保存到 <code>output</code> 目录，并在界面里显示出来。文件名里通常带时间和种子信息，方便你找回同一批生成的结果。保存过的图片历史记录里都可以回看，右键还能预览大图和复制参数。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">8</span>
  3.8 完整连线示范与首次出图
</h2>

<p class="mb-5" data-aos="fade-up">
  理论讲完，动手搭一遍。流程如下：在画布空白处双击搜索，依次添加 Checkpoint Loader、两个 CLIP Text Encode、Empty Latent Image、KSampler、VAE Decode、Save Image，然后按数据流方向连线：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">连线顺序</span>
    <i data-lucide="git-branch" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #98c379;">MODEL</span>   Checkpoint Loader ─────────────► KSampler
<span style="color: #98c379;">CLIP</span>    Checkpoint Loader ──► CLIP Text Encode（正面）─► KSampler (positive)
<span style="color: #98c379;">CLIP</span>    Checkpoint Loader ──► CLIP Text Encode（负面）─► KSampler (negative)
<span style="color: #98c379;">VAE</span>     Checkpoint Loader ──► VAE Decode
<span style="color: #98c379;">LATENT</span>  Empty Latent Image ──► KSampler (latent_image) ──► VAE Decode ──► Save Image</code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  连好后填上提示词：正面写一句清晰描述，负面留一句常见的「低质量、模糊」之类，然后点生成。看到图出来的那一刻，你搭的是第一条完全由自己连出来的链路。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(224,108,117,0.06); border: 1px solid rgba(224,108,117,0.15); border-left: 3px solid #e06c75;" data-aos="fade-up">
  <i data-lucide="triangle-alert" class="w-5 h-5 shrink-0 mt-0.5" style="color: #e06c75;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #e06c75;">常见坑</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      出图报错大多是连线不对：条件线只接进了 positive 或 negative 某一侧、VAE 没接到解码器、画布尺寸设得太大撑爆显存。逐一检查颜色匹配，基本都能定位。
    </p>
  </div>
</div>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      你能自建工作流出图了，但提示词还是随手写、出图忽好忽坏。下一篇教你有章法地写提示词，并接入图生图分支。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：图生图与提示词创作</p>
</div>
