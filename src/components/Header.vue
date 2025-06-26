<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentDateTime = ref("");

const props = defineProps<{
  server: number;
}>();

function updateDateTime() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  currentDateTime.value = now
    .toLocaleDateString("fa-IR-u-nu-latn", options)
    .replace(/\//g, "/");
}

let intervalId: number;

onMounted(() => {
  updateDateTime(); // Initial call
  intervalId = setInterval(updateDateTime, 1000); // Update every second
});

onUnmounted(() => {
  clearInterval(intervalId); // Cleanup on unmount
});
</script>

<template>
  <header class="grid grid-cols-11 gap-4">
    <div class="col-span-3 bg-white shadow-lg rounded-lg p-4">
      <div class="flex justify-center items-center">
        <img src="/pics/image.png" alt="logo" class="h-24 w-24 ml-8" />
        <h2 class="text-2xl font-bold text-gray-800">
          سیستم پایش هوشمند<br />
          نور پردازی کارخانه نوآوری
        </h2>
      </div>
    </div>
    <div class="col-span-5 bg-white shadow-lg rounded-lg p-4">
      <div
        class="grid grid-cols-3 gap-4 mt-6 items-center justify-center text-center"
      >
        <div class="flex items-center justify-center">
          <span class="text-1xl text-gray-500">تاریخ:</span>
          <span class="text-2xl ml-1">{{ currentDateTime.split(" ")[0] }}</span>
        </div>
        <div class="flex items-center justify-center">
          <span class="text-1xl text-gray-500">ساعت:</span>
          <span class="text-2xl ml-1">{{ currentDateTime.split(" ")[1] }}</span>
        </div>
        <div class="flex items-center justify-center">
          <span class="text-1xl text-gray-500">پنل:</span>
          <span class="text-2xl ml-1">مدیریت</span>
        </div>
      </div>
    </div>
    <div class="col-span-3 bg-white shadow-lg rounded-lg p-4 pt-10">
      <div class="text-gray-800 flex justify-center items-center">
        <h1 v-if="server == 0" class="text-2xl font-bold text-blue-500">
          Loading
        </h1>
        <h1 v-else-if="server == 1" class="text-2xl font-bold text-green-500">
          Server is Connected
        </h1>
        <h1 v-else-if="server == 2" class="text-2xl font-bold text-red-500">
          Server is Disconnected
        </h1>
      </div>
    </div>
  </header>
</template>
