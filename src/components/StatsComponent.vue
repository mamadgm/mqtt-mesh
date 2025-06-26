<script setup lang="ts">

defineProps<{
  title: string;
  value: string;
  prefix: string;
  right?: boolean;
}>();
</script>

<template>
  <div class="h-full">
    <h3 class="text-md font-semibold text-gray-700 max-w-32">{{ title }}</h3>
    <div v-if="right" class="flex items-end mt-2 justify-end">
      <p class="text-3xl font-bold text-cyan-600 ml-1">
        {{ value }}
      </p>
      <p class="text-2xl font-bold text-gray-400 ">{{ prefix }}</p>
    </div>
    <div v-else class="flex items-end justify-end mt-2 ">
      <p class="text-2xl font-bold text-gray-400 ">{{ prefix }}</p>
      <p class="text-3xl font-bold text-cyan-600 mr-1">
        {{ value }}
      </p>
    </div>
  </div>
</template>
