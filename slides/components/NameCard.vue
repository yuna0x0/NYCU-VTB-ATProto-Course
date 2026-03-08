<script setup>
defineProps({
  size: { type: String, default: 'md' },
})
</script>

<template>
  <div class="inline-flex items-center gap-3 border border-white/40 rounded-xl"
    :class="size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-5 py-2'">
    <img src="https://yuna0x0.com/avatar.webp" :class="size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'" class="rounded-full" />
    <span><a href="https://yuna0x0.com" class="!border-none">悠奈喵 (yuna0x0)</a></span>
  </div>
</template>
