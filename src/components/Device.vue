<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Power,
  PersonStanding,
  CircleOff,
  BatteryWarning,
} from "lucide-vue-next";

const props = defineProps<{
  runParent: (newState: string) => void;
  title: string;
  code: number;
  wifiActive: boolean;
  sensorActive: boolean;
  currentMode: string;
  online: boolean;
}>();
</script>

<template>
  <div
    class="bg-gray-100 m-1 p-3 flex flex-col justify-center items-center rounded-xl shadow-xl border transition-all hover:shadow-2xl hover:scale-105"
  >
    <div class="flex items-center text-center mb-4 w-full justify-center">
      <h3 class="text-lg font-semibold text-gray-800 text-center">
        {{ title }}
      </h3>
    </div>

    <div v-if="!props.online" class="relative group">
      <BatteryWarning class="w-10 h-10 text-red-500 cursor-help" />
      <div
        class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[400px] bg-black text-white text-[15px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        دستگاه آفلاین است
      </div>
    </div>

    <DropdownMenu v-else>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-between text-gray-800 bg-white hover:bg-gray-50"
        >
          {{ props.currentMode }}
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56 text-right">
        <DropdownMenuLabel>وضعیت</DropdownMenuLabel>
        <DropdownMenuItem @click="props.runParent('on')">
          ✅ روشن (On)
        </DropdownMenuItem>
        <DropdownMenuItem @click="props.runParent('off')">
          ❌ خاموش (Off)
        </DropdownMenuItem>
        <DropdownMenuItem @click="props.runParent('auto')">
          ⚙️ خودکار (Auto)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <div class="flex mt-4 space-x-6">
      <Power
        :class="wifiActive ? 'text-green-500' : 'text-red-500'"
        class="w-8 h-8"
      />
      <PersonStanding v-if="sensorActive" class="w-8 h-8 text-blue-500" />
      <CircleOff v-else class="w-8 h-8 text-gray-400" />
    </div>
  </div>
</template>
