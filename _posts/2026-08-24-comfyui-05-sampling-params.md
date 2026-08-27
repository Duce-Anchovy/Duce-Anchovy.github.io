---
layout: post
title: ComfyUI 从零学习（五）：采样参数与可控生成
date: 2026-08-24
category: AI 绘画
accent_color: purple
read_time: 5
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    上一篇我们学会了写提示词，但同样的词、不同参数，出图结果千差万别。本篇把 KSampler 上的五个旋钮逐一讲透：它们各自管什么、怎么搭配、为什么这么调，让出图可复现、可预期。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>seed 管随机、steps 管精修、cfg 管服从、sampler 管步法、scheduler 管节奏——五个旋钮共同决定采样器如何从噪声画出图像。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  5.1 seed：随机与可复现
</h2>

<p class="mb-5" data-aos="fade-up">
  seed 是采样起始的随机种子，它决定了初始噪声长什么样。同样提示词、同样参数，换一个 seed，得到的就是另一张图。
</p>

<p class="mb-5" data-aos="fade-up">
  固定 seed 的意义在于复现。当你调出一张满意的图，把它的 seed 记下来，以后只要提示词、参数、模型都不变，就能稳定地再生成一张一模一样的。排查「为什么结果变了」时，先确认 seed 是否被动过——它是变量的源头。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  5.2 steps：步数与收敛
</h2>

<p class="mb-5" data-aos="fade-up">
  steps 是采样迭代的步数。它描述的是模型从噪声到成图一共精化多少步：步数太少，图还没「想清楚」就停了，显得粗糙；步数太多，超过收敛点后收益趋近于零，纯属浪费时间。
</p>

<p class="mb-5" data-aos="fade-up">
  不同采样器对步数的敏感度不同。给一个实操取向：多数组合下 20~30 步就足够，追求细节可以提到 30~40，超过 50 步通常提升肉眼几乎不可见。别迷信「越多越好」，把省下的时间拿来做多组 seed 对比更划算。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  5.3 CFG：贴近提示词的程度
</h2>

<p class="mb-5" data-aos="fade-up">
  CFG（分类器自由引导）控制生成结果对提示词的服从程度。CFG 越高，图像越努力贴合提示词描述；越低，越放任模型自由发挥。
</p>

<p class="mb-5" data-aos="fade-up">
  两个极端各有典型表现：CFG 过高（比如 15 以上），色彩容易过饱和、出现「死黑死白」和细节崩坏，还可能出现不自然的描边感；CFG 过低（比如 3 以下），图像会显得平淡、跟提示词脱节。多数模型的推荐区间在 6~9，很多工作流默认 7 左右，先在这个区间内微调。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  5.4 采样器与调度器怎么选
</h2>

<p class="mb-5" data-aos="fade-up">
  采样器（sampler）决定每一步怎么走，调度器（scheduler）决定噪声随时间衰减的节奏。两者搭配使用，常见的组合如下：
</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">组合</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">特点</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">适用</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>euler + normal</strong></td>
        <td class="py-2.5 px-4">经典稳定，兼容性好</td>
        <td class="py-2.5 px-4">通用兜底</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>dpmpp_2m + karras</strong></td>
        <td class="py-2.5 px-4">细节丰富、质量均衡</td>
        <td class="py-2.5 px-4">多数场景首选</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>dpm++ 系 + karras</strong></td>
        <td class="py-2.5 px-4">更细腻，速度略慢</td>
        <td class="py-2.5 px-4">高质量出图</td>
      </tr>
    </tbody>
  </table>
</div>

<p class="mb-5" data-aos="fade-up">
  给一条「缺省推荐」：拿不准就用 <code>dpmpp_2m + karras</code>，配 20~30 步、CFG 7，这是社区里最常见、也最不容易出错的组合。其余组合多是为了特定风格或特殊模型服务的，等有明确需求再换。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  5.5 批量与分辨率
</h2>

<p class="mb-5" data-aos="fade-up">
  批量（batch size）一次生成多张图，方便横向对比挑好的。分辨率则直接决定显存占用和画质上限：分辨率越高，潜空间张量越大，越吃显存，出图也越清晰。
</p>

<p class="mb-5" data-aos="fade-up">
  小显存用户的策略是先小后大：在低分辨率下确定构图和风格，再用放大手段（第六篇讲）提升清晰度，而不是一上来就硬开大图。批量也是如此，显存紧张时一次一张、多跑几次 seed，比一次塞满更稳。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  5.6 实战：控制变量对比出图
</h2>

<p class="mb-5" data-aos="fade-up">
  理论再好，不如亲手摸一遍手感。方法很简单：固定 seed 和提示词，一次只改一个参数，连出几组对比图。比如固定其他不变，把 CFG 依次设成 5、7、9、12，看看每张图的色彩和细节变化；再把 steps 依次设成 10、20、30，感受收敛的过程。
</p>

<p class="mb-5" data-aos="fade-up">
  这组「控制变量实验」做完，你对每个旋钮的体感就建立起来了。以后看到一张图崩了，你能立刻判断出是 CFG 太高还是步数太少，而不是盲目重抽 seed 碰运气。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      参数可控了，但想精确控制构图、姿势、局部细节，光靠采样器还不够。下一篇引入 LoRA 和 ControlNet 这些「模型伴侣」。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：模型与进阶控制</p>
</div>
