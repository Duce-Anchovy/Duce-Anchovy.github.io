---
layout: post
title: ComfyUI 从零学习（一）：开篇总览，认识 ComfyUI
date: 2026-08-20
category: AI 绘画
accent_color: purple
read_time: 4
---

<div class="mb-8 p-5 rounded-xl" style="background: rgba(198,120,221,0.05); border: 1px solid rgba(198,120,221,0.12); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed italic" style="color: var(--fg-subtle);">
    这是「ComfyUI 从零学习」系列的第一篇。整条系列会从认识工具、搭建环境开始，一路走到模型控制、工作流自动化，最后用一篇实战收尾。本篇先不碰操作细节，只帮你建立正确的认知，并完成第一个「动手成功」。
  </p>
</div>

<div class="my-6 p-5 rounded-xl" style="background: var(--card-solid); border: 1px solid var(--border-soft);" data-aos="fade-up">
  <p class="text-[14px] leading-relaxed mb-0" style="color: var(--fg-subtle);">
    <strong>一句话总结：</strong>ComfyUI 把「生成一张图」拆成了一堆看得见、连得上的节点。你看到什么，它就做什么，每一步都摆在台面上。
  </p>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">★</span>
  1.1 ComfyUI 是什么
</h2>

<p class="mb-5" data-aos="fade-up">
  ComfyUI 是一款节点式的图像生成工具。你可以把它理解成一块画布，画布上摆着一个个功能方块，方块之间用线连起来，数据顺着连线流动，最后在终点得到一张图片。
</p>

<p class="mb-5" data-aos="fade-up">
  它常被拿来和 Stable Diffusion WebUI（也叫 A1111）比较。WebUI 把所有参数藏进一个表单里，点一下「生成」就完事，适合快速出图；ComfyUI 则把整个过程摊开，每一步都是一个节点，想改哪里就改哪里。这种设计带来两个直接好处：一是生成过程完全透明，你能看见图片是怎么一步步长出来的；二是可以把搭好的流程保存成工作流文件，随时复用、分享，甚至用脚本批量调用。
</p>

<p class="mb-5" data-aos="fade-up">
  适合用它的人群，主要是愿意花一点时间理解原理、想对生成过程有更多控制的人，以及有批量、自动化生产需求的人。只想随手出一张好看图的用户，WebUI 会更省心。不过一旦你理解了节点的逻辑，ComfyUI 的上限明显更高。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">1</span>
  1.2 核心术语速览
</h2>

<p class="mb-5" data-aos="fade-up">后面几篇会反复提到这些词，先混个脸熟，遇到再看也不迟：</p>

<div class="overflow-x-auto my-8" data-aos="fade-up">
  <table class="w-full text-[14px] leading-relaxed" style="border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid var(--border);">
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">术语</th>
        <th class="text-left py-2.5 px-4" style="color: var(--fg-bright);">一句话解释</th>
      </tr>
    </thead>
    <tbody style="color: var(--fg);">
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>节点</strong></td>
        <td class="py-2.5 px-4">画布上的一个功能方块，负责一件事，比如加载模型、采样、保存图片</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>连线</strong></td>
        <td class="py-2.5 px-4">节点之间的数据传输通道，数据从输出端流向输入端</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>工作流</strong></td>
        <td class="py-2.5 px-4">整张画布上的节点与连线，保存成文件就是一套完整流程</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>Checkpoint</strong></td>
        <td class="py-2.5 px-4">完整的大模型文件，装着一整套生成能力，通常以 .safetensors 结尾</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>Sampler</strong></td>
        <td class="py-2.5 px-4">采样器，负责在潜空间里一步步「画出」图像的过程</td>
      </tr>
      <tr style="border-bottom: 1px solid var(--border-soft);">
        <td class="py-2.5 px-4"><strong>Latent</strong></td>
        <td class="py-2.5 px-4">潜空间数据，图像被压缩后的中间表示，模型在这层空间里工作</td>
      </tr>
      <tr>
        <td class="py-2.5 px-4"><strong>VAE</strong></td>
        <td class="py-2.5 px-4">变分自编码器，负责潜空间和真实像素之间的转换</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">2</span>
  1.3 需要什么样的电脑
</h2>

<p class="mb-5" data-aos="fade-up">
  ComfyUI 的算力大头在显卡上。一张 NVIDIA 显卡、显存 8GB 起步是最舒服的配置，16GB 以上可以比较自由地开高分放大和各类控制模型。显存决定你能生成多大多清晰的图，也决定同时能加载多少模型。
</p>

<p class="mb-5" data-aos="fade-up">
  内存建议 16GB 起步，主要是给系统和模型加载留出余量。硬盘上，一个常用模型往往好几个 GB，多下几个就占掉几十 GB，建议给模型目录留足空间。
</p>

<p class="mb-5" data-aos="fade-up">
  显卡显存不够也有降级方案：分辨率开小一点、采样步数少一点、关掉一些吃显存的节点，小显存照样能跑。至于纯 CPU 运行，技术上可以，但生成一张图动辄几分钟到十几分钟，只适合体验，不建议作为日常方案。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">3</span>
  1.4 三种安装方式怎么选
</h2>

<p class="mb-5" data-aos="fade-up">ComfyUI 常见的安装方式有三条路，按自己的情况选：</p>

<ul class="mb-6 space-y-2.5 pl-1" style="list-style: none;" data-aos="fade-up">
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>官方桌面版</strong>：ComfyUI 团队提供的桌面应用，带安装向导和图形界面，适合不想碰命令行的新手，后续升级也省心</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>Git + Python 手动装</strong>：从源码克隆、用 Python 装依赖，可控性最强，适合熟悉命令行、想紧跟最新版本的玩家</span>
  </li>
  <li class="flex items-start gap-3">
    <i data-lucide="check-circle" class="w-[18px] h-[18px] mt-0.5 shrink-0" style="color: #c678dd;"></i>
    <span><strong>一键整合包</strong>：第三方把 Python 环境、依赖、常用模型打包在一起，解压即用，适合怕麻烦、想最快跑起来的用户，代价是更新没那么及时</span>
  </li>
</ul>

<p class="mb-5" data-aos="fade-up">
  无论哪条路，装好后都会得到一个本地网址（默认 <code>127.0.0.1:8188</code>），浏览器打开就是 ComfyUI 界面。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">4</span>
  1.5 模型文件放哪里
</h2>

<p class="mb-5" data-aos="fade-up">
  ComfyUI 的模型都放在安装目录下的 <code>models</code> 文件夹里，按用途分子目录。理清结构，以后下载模型就不会放错地方：
</p>

<div class="my-8 rounded-xl overflow-hidden" style="background: #21252b; border: 1px solid rgba(62,68,81,0.8); box-shadow: 0 8px 30px rgba(0,0,0,0.2);" data-aos="fade-up">
  <div class="px-5 py-2.5 flex items-center justify-between" style="border-bottom: 1px solid rgba(62,68,81,0.6); background: rgba(0,0,0,0.15);">
    <span class="text-[12px]" style="color: #5c6370;">models/ 目录速览</span>
    <i data-lucide="folder" class="w-3.5 h-3.5" style="color: #4b5263;"></i>
  </div>
  <pre class="p-5 text-[13px] font-mono leading-[1.8] overflow-x-auto" style="color: #abb2bf;"><code><span style="color: #98c379;">checkpoints</span><span style="color: #5c6370;">/   完整大模型（.safetensors / .ckpt）</span>
<span style="color: #98c379;">loras</span><span style="color: #5c6370;">/      轻量风格/角色模型（.safetensors）</span>
<span style="color: #98c379;">vae</span><span style="color: #5c6370;">/         专用的 VAE 文件（可选）</span>
<span style="color: #98c379;">controlnet</span><span style="color: #5c6370;">/   结构控制模型</span>
<span style="color: #98c379;">embeddings</span><span style="color: #5c6370;">/   负面/风格嵌入词条</span>
<span style="color: #98c6379;">output</span><span style="color: #5c6370;">/       生成图片的输出目录</span></code></pre>
</div>

<p class="mb-5" data-aos="fade-up">
  模型来源主要是社区平台，比如 Civitai、Hugging Face，上面按类型和用途分了类，下载时注意看它属于哪类模型，放进对应目录即可。
</p>

<h2 class="text-[22px] font-bold mt-12 mb-4 flex items-center gap-3" style="color: var(--fg-bright);" data-aos="fade-up">
  <span class="w-6 h-6 rounded-md flex items-center justify-center text-[12px] font-bold" style="background: linear-gradient(135deg, #61afef, #c678dd); color: #21252b;">5</span>
  1.6 首次启动与第一个动作
</h2>

<p class="mb-5" data-aos="fade-up">
  装好并启动后，界面上通常是空白的画布。第一次动手，最省事的办法是加载官方自带的示例工作流：在界面菜单里找「Workflow」或直接拖入官方示例文件，界面上就会出现一条完整的文生图链路。
</p>

<p class="mb-5" data-aos="fade-up">
  接着在提示词节点里写一句简单的描述，点下「Queue Prompt」或快捷键生成，稍等片刻，一张图就出现在右侧预览里。到这一步，你其实已经完成了一次完整的生成。整个过程里，你可能会盯着那条链路疑惑：每个节点到底在干嘛？这份疑惑正合适，它是接下来所有篇章的引子。
</p>

<div class="my-8 p-5 rounded-xl flex items-start gap-3" style="background: rgba(198,120,221,0.06); border: 1px solid rgba(198,120,221,0.15); border-left: 3px solid #c678dd;" data-aos="fade-up">
  <i data-lucide="lightbulb" class="w-5 h-5 shrink-0 mt-0.5" style="color: #c678dd;"></i>
  <div>
    <p class="text-[13px] font-semibold mb-1" style="color: #c678dd;">本篇之后</p>
    <p class="text-[13px] leading-relaxed" style="color: var(--fg-subtle);">
      你已经能用现成工作流出图了，但对链路上每个节点在做什么仍然一头雾水。下一篇会带你装好环境、认识界面，把这块拼图补上。
    </p>
  </div>
</div>

<div class="mt-14 pt-8 text-center" style="border-top: 1px dashed rgba(62,68,81,0.6);" data-aos="fade-up">
  <p class="text-[13px] italic mb-2" style="color: #c678dd;">感谢阅读</p>
  <p class="text-[12px]" style="color: #4b5263;">下一篇：环境搭建与界面认知</p>
</div>
