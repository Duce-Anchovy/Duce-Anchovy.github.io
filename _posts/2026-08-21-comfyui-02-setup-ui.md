---
layout: post
title: ComfyUI 从零学习（二）：环境搭建与界面认知
date: 2026-08-21
category: AI 绘画
accent_color: purple
read_time: 5
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    上一篇我们用现成工作流出了第一张图。本篇把「会用」升级成「看懂结构」：把界面每个区域摸清楚，把节点操作练顺手，并搞懂工作流文件到底是什么。这样到了下一篇，你就能自己从头连出一条能出图的链路。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>ComfyUI 的工作流就是一张图数据，节点是操作、连线是数据流，界面只是这块画布的窗口。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  2.1 界面五区域详解
</h2>

<p class="mb-5" data-aos="fade-up">打开 ComfyUI，界面大致可以分成五个区域，各司其职：</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">区域</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">职责</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>节点画布</strong></td>
        <td class="py-2.5 px-4">工作流本体所在，所有节点和连线都摆在这里，占界面最大面积</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>侧栏</strong></td>
        <td class="py-2.5 px-4">工作流的加载、保存入口，也承载图库、节点列表等辅助面板</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>队列面板</strong></td>
        <td class="py-2.5 px-4">显示等待生成的任务列表，以及当前任务的进度</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>模型栏</strong></td>
        <td class="py-2.5 px-4">在模型类节点上点选时，列出对应目录里的模型文件</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>菜单栏</strong></td>
        <td class="py-2.5 px-4">工作流、设置、工具等全局操作入口</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  2.2 节点基础操作
</h2>

<p class="mb-5" data-aos="fade-up">
  画布上的一切操作都是为了更快地搭好节点图。几个高频操作用法如下：在画布空白处双击，会弹出节点搜索框，输入名字就能添加节点；从一个节点的输出端拖出线条，连到另一个节点的输入端，数据就接上了；选中节点按删除键移除，按住 Ctrl 拖拽可以复制。平移画布用鼠标中键或空格加拖动，缩放用滚轮，还嫌乱可以按快捷键让所有节点自动排整齐。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(97,175,239,0.06); border: 1px solid rgba(97,175,239,0.15); border-left: 3px solid #61afef;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #61afef;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #61afef;">提示</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      把常用快捷键记成本能，搭工作流的速度能快上一大截。官方文档和界面底部的快捷键列表都可以随时查。
    </p>
  </div>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  2.3 连线为什么有颜色
</h2>

<p class="mb-5" data-aos="fade-up">
  你会注意到不同连线颜色不同。颜色代表数据类型：数据必须类型匹配才能连上，型号对了才接得进去。最常见的几种类型如下：
</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">类型</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">含义</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>MODEL</strong></td>
        <td class="py-2.5 px-4">模型本体，承载生成能力，从 Checkpoint 等加载器输出</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>CLIP</strong></td>
        <td class="py-2.5 px-4">文本编码器，负责把提示词翻译成机器能理解的条件</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>VAE</strong></td>
        <td class="py-2.5 px-4">潜空间与像素互转的解码/编码器</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>LATENT</strong></td>
        <td class="py-2.5 px-4">潜空间图像数据，采样器的工作对象</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>CONDITIONING</strong></td>
        <td class="py-2.5 px-4">提示词编码后的条件数据，指导采样方向</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>IMAGE</strong></td>
        <td class="py-2.5 px-4">真正的像素图像，解码后的最终产物</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  2.4 工作流文件的本质
</h2>

<p class="mb-5" data-aos="fade-up">
  保存工作流时得到的是一个 <code>.json</code> 文件。它里面记录的无非是两件事：画布上有哪些节点、节点之间怎么连线。换句话说，工作流文件就是这张图数据的文字描述。
</p>

<p class="mb-5" data-aos="fade-up">
  理解了这一点，很多问题就有了思路。工作流文件打不开或加载报错，多半是 JSON 格式损坏，或者引用了缺失的节点。前者可以用格式化工具打开文件检查结构，看括号有没有配对；后者常见于换了一台电脑、没装对应自定义节点的情况，补上节点即可。至少，你不会再把它当成什么神秘的黑盒。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  2.5 队列与执行机制
</h2>

<p class="mb-5" data-aos="fade-up">
  点下生成按钮后，任务不会直接开跑，而是先进入队列。ComfyUI 会按顺序处理队列里的任务，后到的排队等前一个完成。队列面板里能看到每个任务的状态和进度。
</p>

<p class="mb-5" data-aos="fade-up">
  执行顺序也不靠画布上的位置决定，而是靠节点之间的依赖关系：一个节点只有等它输入来源的节点算完，才会开始算自己。这是节点式工具和普通脚本最大的不同，也是它天然适合批量、复杂流程的原因。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">6</span>
  2.6 小练习：从空白画布搭起
</h2>

<p class="mb-5" data-aos="fade-up">
  这一篇的收尾练习，请把画布清空，试着不借助任何示例，仅仅通过双击搜索节点，手动搭出一个简单的节点图。搭什么不重要，重要的是感受那份节奏：搜索节点、拖到位、连线、调整参数。等你能熟练地凭空摆放节点，下一篇讲的最小闭环链路对你来说就是水到渠成。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      你对画布已经游刃有余，但一条能出图的完整链路长什么样还没亲眼见过。下一篇就来搭这条最小闭环。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：文生图基础链路</p>
</div>
