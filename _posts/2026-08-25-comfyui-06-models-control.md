---
layout: post
title: ComfyUI 从零学习（六）：模型与进阶控制
date: 2026-08-25
category: AI 绘画
accent_color: purple
read_time: 8
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    第五篇我们把采样参数调顺了，但光靠提示词和参数，很难精确控制构图、姿势和局部细节。本篇是进阶的分水岭：引入 LoRA 轻量换风格、ControlNet 精确钳制结构、遮罩重绘局部修改，最后串一条「从草稿到成品」的完整流水线。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>LoRA 换风格、ControlNet 定结构、遮罩改局部、放大提清晰——四件套各管一摊，合起来让画面听你指挥。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  6.1 LoRA：轻量换风格/换角色
</h2>

<p class="mb-5" data-aos="fade-up">
  LoRA 是一种轻量模型，几百 MB 就能给大模型注入特定风格或角色特征，不用重新训练整个 Checkpoint。它的好处是即插即用：加载一个 LoRA，画面就会向那个风格偏移，不想要了随时卸载。
</p>

<p class="mb-5" data-aos="fade-up">
  用法上，通过 LoRA Loader 节点加载，接到 Checkpoint 的 MODEL 和 CLIP 输出之间。LoRA 通常带一个「触发词」，写在提示词里才会激活对应特征。权重参数控制影响强度，一般 0.5~1.0 比较稳妥，太高容易失真。多个 LoRA 也可以叠加，但每叠一个都要适当调低权重，防止互相打架。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  6.2 ControlNet 原理简介
</h2>

<p class="mb-5" data-aos="fade-up">
  提示词只能「描述」画面，ControlNet 却能「钳制」画面结构。它会额外接收一张控制图（线稿、深度图、姿势骨架等），在采样过程中逐层引导生成结果贴合这张图的几何结构。
</p>

<p class="mb-5" data-aos="fade-up">
  与单纯提示词的本质区别就在这里：提示词靠语义影响，模糊且间接；ControlNet 靠几何约束，具体而直接。你想要主角摆出某个姿势，写一百个词都不如一张姿态骨架图来得准。它是进阶阶段最值得掌握的能力之一。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  6.3 常用 ControlNet 类型拆解
</h2>

<p class="mb-5" data-aos="fade-up">不同 ControlNet 吃不同的控制图，适用场景也不同。常用几种如下：</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">类型</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">控制图</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">适用场景</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>canny</strong></td>
        <td class="py-2.5 px-4">边缘线稿</td>
        <td class="py-2.5 px-4">保留构图与轮廓</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>depth</strong></td>
        <td class="py-2.5 px-4">深度图</td>
        <td class="py-2.5 px-4">保持空间层次与景深</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>openpose</strong></td>
        <td class="py-2.5 px-4">人体姿态骨架</td>
        <td class="py-2.5 px-4">锁定人物姿势</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>lineart</strong></td>
        <td class="py-2.5 px-4">手绘/插画线稿</td>
        <td class="py-2.5 px-4">线稿上色、描线细化</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  6.4 遮罩重绘 Inpainting
</h2>

<p class="mb-5" data-aos="fade-up">
  图生图只能整体重绘，遮罩重绘则能「只改局部」。流程是：加载原图 → 加载一张遮罩图（白色是要改的区域，黑色是保留区域）→ 设置噪声遮罩节点，把遮罩区域之外的潜空间数据「冻住」，采样时只对白色区域重新生成。
</p>

<p class="mb-5" data-aos="fade-up">
  这是修细节的利器：想改掉画面里的一只手、换一个背景角落、修正一处崩坏，画个遮罩圈住它，其余部分纹丝不动。配合 denoise 参数，还能控制改动的激进程度，实现精细可控的局部精修。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  6.5 高清放大策略
</h2>

<p class="mb-5" data-aos="fade-up">
  直接生成大图既慢又吃显存，更聪明的做法是先小后大：先在低分辨率下确定内容，再放大提升清晰度。放大有两条路：
</p>

<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>Latent Upscale</strong>：在潜空间里放大后再次采样，补细节快，适合轻度放大</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>真放大模型（ESRGAN 等）</strong>：在像素层面放大，细节更扎实，适合追求高清成片</span>
  </li>
</ul>

<p class="mb-5" data-aos="fade-up">
  实际工作流常把两者结合：Latent Upscale 先把图撑大，再走一遍低 denoise 的采样补齐细节，必要时最后接真放大模型。这样既控制显存，又拿到清晰成品。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  6.6 进阶综合：从草稿到成品
</h2>

<p class="mb-5" data-aos="fade-up">
  把本篇的工具串成一条完整流水线，就得到了进阶阶段最常见的生产链路：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">生产流水线</span>
    <i data-lucide="workflow" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #98c379;">线稿</span> ──► ControlNet（lineart）──► 采样出基础图
                 │
                 ▼
<span style="color: #98c379;">基础图</span> ──► 遮罩重绘（改局部细节）
                 │
                 ▼
<span style="color: #98c379;">精修图</span> ──► Latent Upscale + 低denoise采样 ──► 真放大模型 ──► 高清成品</code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  线稿定结构、ControlNet 起步、遮罩修局部、放大出成片，四步各司其职。把这条链路搭成工作流保存下来，以后同类需求就是换个图、改几句词的事。到这里，微观层面的控制你已经信手拈来。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      微观控制信手拈来，但每次都要手动调、手动存，效率太低。下一篇让工作流替你干活：批量处理、API 调用、自动化管理。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：工作流管理与自动化</p>
</div>
