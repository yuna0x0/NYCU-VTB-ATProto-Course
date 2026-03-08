---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: ./assets/sky.png
# some information about your slides (markdown enabled)
title: AT Protocol 從零開始喵
# info: |
#   ## slidev starter template
#   presentation slides for developers

#   learn more at [sli.dev](https://sli.dev)
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: fade-out
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
fonts:
  sans: 'LINE Seed JP' 
  # sans: 'Source Sans 3'
  # sans: 'Libertinus Serif'

  # sans: 'SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New'
  # local: 'SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New'
themeConfig:
  primary: '#f291a5'
colorSchema: dark
---
# AT Protocol 從零開始喵

<br>

<div class="inline-flex items-center gap-3 border border-white/40 rounded-xl px-5 py-2">
  <img src="https://yuna0x0.com/avatar.webp" class="w-8 h-8 rounded-full" />
  <span><a href="https://yuna0x0.com" class="!border-none">Yuna | 星ノ宮ゆうな</a></span>
</div>

<!--<div @click="$slidev.nav.next" class="mt-12 py-1" hover:bg="white op-10"> <carbon:arrow-right />
</div>-->

<div class="abs-br m-6 text-xl">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="slidev-icon-btn">
    <carbon:edit />
  </button>
  <a href="https://github.com/yuna0x0/NYCU-VTB-ATProtoCourse" target="_blank" class="slidev-icon-btn">
    <carbon:logo-github />
  </a>
</div>

---
dragPos:
  sherry: 43,181,331,327,-5
  discord-help: 365,292,593,68
---

# 有問題想問！？

### 可以在 **<a href="https://discord.gg/GPBJPshrBU">交大 VTuber 社</a>** Discord 伺服器的 <a href="https://discord.com/channels/806901909356412949/1478581760270008474">`#at-protocal-by-yuna`</a> 頻道<br>發問！

<img v-drag="'discord-help'" src="./assets/discord-help.png">

<img v-drag="'sherry'" src="./assets/sherry-1.webp">

<style>
.slidev-vclick-target {
  transition: opacity 100ms ease;
}

.slidev-vclick-hidden {
  opacity: 0.2 !important;
  pointer-events: none;
}
</style>

---
---

<div class="absolute top-0 left-0 bottom-0 w-1/2 overflow-hidden">
<video autoplay loop muted playsinline class="absolute inset-0 w-full h-full object-cover hue-rotate-130">
<source src="./assets/sakana.mp4" type="video/mp4" />
</video>
<div class="absolute inset-0 bg-black/30" />
<div class="absolute bottom-0 left-0 right-0 flex justify-center z-10">
<SakanaWidget />
</div>
</div>
<div class="ml-[50%] pl-8">

# **Yuna | 星ノ宮ゆうな**

<h2 v-click="[1, 2]">熱愛研究各種東西<br>和開發遊戲的貓娘 :3</h2>

<br>

<li v-click="[2, 3]">交大 VTuber 社 - <span v-mark.box.purple="[2, 3]">創社社長</span></li>

<li v-click="[3, 4]">
    致力於推廣<span v-mark.underline.orange="[3, 4]" class="text-orange-400">去中心化</span>相關技術 <img src="https://cdn.discordapp.com/emojis/1325166382647607327.webp" title=":yunaHeart:" alt=":yunaHeart:" class="inline-block h-6" />
</li>

<li v-click="[4, 5]">
    興趣太多，族繁不及備載<br>詳細可以去 <a href="https://yuna0x0.com">yuna0x0.com</a> 看喵~
</li>

<div v-click="[5, 6]" class="text-center">
    <br>
    <h3>餵食 Yuna 🥺</h3>
    <br>
    <img src="./assets/yuna-donate.webp" class="w-[130px] mx-auto">
</div>

</div>

<style>
.slidev-vclick-target {
    transition: opacity 0.5s ease;
}

.slidev-vclick-hidden {
  opacity: 0.2 !important;
  pointer-events: none;
}
</style>

---
class: text-center
---

# 第一堂課程規劃

<div class="grid grid-cols-3 gap-6 mt-8">
  <div v-click="[1, 6]" class="flex flex-col items-center justify-center border border-white/20 rounded-xl p-6 h-full">
    <lucide:at-sign class="text-5xl mb-4" />
    <p class="text-center text-lg font-bold !leading-[2]"><span class="color-orange">AT Protocol</span> 是什麼？</p>
  </div>
  <div v-click="[6, 7]" class="flex flex-col items-center justify-center border border-white/20 rounded-xl p-6 h-full">
    <lucide:bot class="text-5xl mb-4" />
    <p class="text-center text-lg font-bold !leading-[2]">實作一個<span class="color-rose">機器人</span><br>在 Bluesky 上互動</p>
  </div>
  <div v-click="[7, 8]" class="flex flex-col items-center justify-center border border-white/20 rounded-xl p-6 h-full">
    <lucide:newspaper class="text-5xl mb-4" />
    <p class="text-center text-lg font-bold !leading-[2]">實作<span v-mark.underline.purple="[3, 4]" class="color-lime">自己的演算法</span><br>讓河道顯示想看的內容！</p>
  </div>
</div>

<div class="details-area relative mt-20 text-white/80 text-xl h-12">
  <div v-click="[1, 6]" class="absolute inset-x-0 flex justify-center gap-3 flex-wrap">
    <span v-mark.box.pink="[2, 3]" class="inline-flex border border-white/40 rounded-xl px-5 py-2">設計理念</span>
    <span v-mark.box.pink="[3, 4]" class="inline-flex border border-white/40 rounded-xl px-5 py-2">身份系統 (DID)</span>
    <span v-mark.box.pink="[4, 5]" class="inline-flex border border-white/40 rounded-xl px-5 py-2">資料儲存（PDS)</span>
    <span v-mark.box.pink="[5, 6]" class="inline-flex border border-white/40 rounded-xl px-5 py-2">與&nbsp;<span class="color-blue">Bluesky</span>&nbsp;(App View) 的關係</span>
  </div>
  <div v-click="[6, 7]" class="absolute inset-x-0 flex justify-center gap-3 flex-wrap">
    <span class="inline-flex border border-white/40 rounded-xl px-5 py-2">透過&nbsp;<span class="color-purple">HTTP API (XRPC)</span>&nbsp;實作一個能自動發文、回覆、按讚的機器人</span>
  </div>
  <div v-click="[7, 8]" class="absolute inset-x-0 flex justify-center gap-3 flex-wrap">
    <span class="inline-flex border border-white/40 rounded-xl px-5 py-2">建立&nbsp;<span class="color-purple">Feed Generator</span>，根據自訂規則篩選貼文，打造專屬的個人化動態牆</span>
  </div>
</div>

<style>
.slidev-vclick-target {
    transition: opacity 0.5s ease;
}

.slidev-vclick-hidden {
  opacity: 0.2 !important;
  pointer-events: none;
}

.details-area .slidev-vclick-hidden {
  opacity: 0 !important;
}
</style>
