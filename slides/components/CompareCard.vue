<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 border border-white/20 rounded-xl p-8">
    <slot name="icon" />
    <p class="text-2xl font-bold !leading-[1.5] text-center">{{ title }}</p>
    <p v-if="desc" class="text-base text-white/50" v-html="desc" />
  </div>
</template>
