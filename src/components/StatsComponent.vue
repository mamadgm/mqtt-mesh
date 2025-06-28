<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
  prefix: string;
  right?: boolean;
}>();
</script>

<template>
  <div class="h-full flex flex-col justify-between font-yekan">
    <!-- Top title aligned to top-left -->
    <h3 class="text-[12px] xl:text-[18px] font-semibold text-gray-700 max-w-40 self-start">
      {{ title }}
    </h3>

    <!-- Bottom value + prefix aligned to bottom-left -->
    <div class="flex items-end justify-start self-end">
      <div v-if="right" class="flex items-end">
        <p class="text-3xl font-bold text-cyan-600 ml-1">
          {{ value }}
        </p>
        <p class="text-1xl text-gray-400">
          {{ prefix }}
        </p>
      </div>
      <div v-else class="flex items-end">
        <p class="text-1xl text-gray-400 ml-1">
          {{ prefix }}
        </p>
        <p class="text-3xl font-bold text-cyan-600">
          {{ value }}
        </p>
      </div>
    </div>
  </div>
</template>
