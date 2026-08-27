---
layout: post
title: ComfyUI 从零学习（四）：图生图与提示词创作
date: 2026-08-23
category: AI 绘画
accent_color: purple
read_time: 6
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    上一篇我们用文生图链路出了第一张图。本篇补上图生图分支，再把「写提示词」从玄学变成一套可复制的方法：正面怎么写、负面怎么防、权重怎么强调，最后用同一张草图练出三种风格。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>图生图 = 把现有图片编码进潜空间再采样，用 denoise 控制改动幅度；提示词 = 按「主体→场景→风格→光影→细节」的顺序把画面描述清楚。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  4.1 图生图分支：Load Image + VAE Encode
</h2>

<p class="mb-5" data-aos="fade-up">
  文生图从空白噪声出发，图生图则从一张真实图片出发。区别只在一处：在链路的开头，用 Load Image 加载本地图片，再用 VAE Encode 把它压回潜空间，替代 Empty Latent Image 作为采样器的输入。
</p>

<p class="mb-5" data-aos="fade-up">
  关键参数是 KSampler 里的 <code>denoise</code>（去噪强度），它决定「改多少」。denoise 越小越接近原图，越大越自由发挥：0.3 左右是轻微调整，0.6 上下是明显重绘，接近 1 基本等同于文生图。理解了这个旋钮，图生图就从「碰运气」变成了「控制变量」。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  4.2 图生图的三种玩法
</h2>

<p class="mb-5" data-aos="fade-up">同一张图生图，目标不同，参数取向也不同，大致有三种玩法：</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">玩法</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">目标</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">参数取向</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>风格重绘</strong></td>
        <td class="py-2.5 px-4">保留主体，换成另一种画风</td>
        <td class="py-2.5 px-4">denoise 中高 + 风格词</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>保留构图</strong></td>
        <td class="py-2.5 px-4">大致布局不变，局部微调</td>
        <td class="py-2.5 px-4">denoise 低 + 少改提示词</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>局部微调</strong></td>
        <td class="py-2.5 px-4">只改某一处，其余保持</td>
        <td class="py-2.5 px-4">配合遮罩重绘（第六篇讲）</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  4.3 正面提示词的基本写法
</h2>

<p class="mb-5" data-aos="fade-up">
  写正面提示词最怕堆砌和混乱。推荐按固定顺序组织，模型理解起来最顺：主体 → 场景 → 风格 → 光影 → 细节。举个例子：先写「一位穿红裙的少女」（主体），再补「花园、午后」（场景），接着「水彩风格」（风格），然后「柔和逆光」（光影），最后「飘落的樱花花瓣」（细节）。
</p>

<p class="mb-5" data-aos="fade-up">
  写法上分两派：自然语言派用完整句子描述，像跟人说话；标签式派用逗号分隔的关键词堆叠，接近 WebUI 的习惯。ComfyUI 两者都接受，新手建议自然语言起步，逐步混入标签词提高效率。原则是「描述清楚，别啰嗦」——模型会在这些词之间平衡。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  4.4 负面提示词与防崩词
</h2>

<p class="mb-5" data-aos="fade-up">
  负面提示词用来约束模型「别画什么」。最省事的做法是放一段通用防崩词，把常见的崩图因素挡在门外：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">通用负面词示例</span>
    <i data-lucide="ban" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #98c379;">blurry, low quality, jpeg artifacts, deformed hands, extra fingers,</span>
<span style="color: #98c379;">bad anatomy, watermark, text, signature, ugly, oversaturated,</span>
<span style="color: #98c379;">mutated, disfigured</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  防崩词不是越多越好，堆太满反而会互相干扰。选几条高频的固定放着，针对具体画面的问题再临时加词，比如画人时补「bad hands、extra fingers」这类手部问题。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  4.5 权重与强调语法
</h2>

<p class="mb-5" data-aos="fade-up">
  想让某个词在画面里占更大分量，可以用权重语法强调。ComfyUI 里常用三种写法：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">强调语法</span>
    <i data-lucide="code" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #98c379;">(keyword)</span>          括号提升权重（约 1.1 倍）
<span style="color: #98c379;">(keyword:1.4)</span>      显式权重，数字越大越重要
<span style="color: #98c379;">[keyword]</span>          方括号降低权重
<span style="color: #98c379;">keyword1 AND keyword2</span>  组合多个概念，可分别加权</code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  注意和 WebUI 语法的细微差别：WebUI 也是括号语法，但 ComfyUI 对嵌套括号、权重写法解析更严格，偶尔会要求用 <code>:数字</code> 的显式写法更保险。权重的建议是「轻提」：0.9~1.4 之间微调，别一上来就 2.0，容易把画面撑变形。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  4.6 实战：同一张草图改出三种风格
</h2>

<p class="mb-5" data-aos="fade-up">
  把所有技巧串一遍。准备一张简单草图（线稿或色块都行），接入图生图链路，denoise 设到 0.7 左右，然后分别换三组提示词：
</p>

<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>水彩风</strong>：主体描述 + watercolor style, soft colors, paper texture</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>赛博朋克</strong>：主体描述 + cyberpunk, neon lights, rainy night street</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>动漫厚涂</strong>：主体描述 + anime style, cel shading, vibrant colors</span>
  </li>
</ul>

<p class="mb-5" data-aos="fade-up">
  用固定的 seed 连出三张对比图，你会发现：提示词里的「风格词」几乎决定了整体观感，而结构靠原图托底。这一套练熟，提示词就不再是玄学。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      提示词有章法了，但同样的词不同人出图不同。下一篇把采样参数讲透，让出图变得可复现、可预期。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：采样参数与可控生成</p>
</div>
