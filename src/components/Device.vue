<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ref } from "vue";
import { Power, PersonStanding, CircleOff } from "lucide-vue-next";
import { sendCommand } from "@/lib/api";

const props = defineProps<{
  title: string;
  code: number; // assumed to be MAC address or device ID
  wifiActive: boolean;
  sensorActive: boolean;
  currentMode : string
}>();

const state = ref<string>(props.currentMode);

const updateState = async (newState: "on" | "off" | "auto") => {
  if (state.value === newState) return;
  state.value = newState;
  try {
    const res = await sendCommand(String(props.code), { command: newState });
    console.log("✅ Sent:", res);
  } catch (err) {
    console.error("❌ Command failed:", err);
  }
};
</script>

<template>
  <div
    class="bg-gray-100 m-3 p-5 flex flex-col justify-center items-center rounded-xl shadow-xl border transition-all hover:shadow-2xl hover:scale-105"
  >
    <div class="flex items-center text-center mb-4 w-full justify-center">
      <h3 class="text-lg font-semibold text-gray-800 text-center">
        {{ title }}
      </h3>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-between text-gray-800 bg-white hover:bg-gray-50"
        >
          {{ state }}
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
        <DropdownMenuItem @click="updateState('on') ">
          ✅ روشن (On)
        </DropdownMenuItem>
        <DropdownMenuItem @click="updateState('off')">
          ❌ خاموش (Off)
        </DropdownMenuItem>
        <DropdownMenuItem @click="updateState('auto')">
          ⚙️ خودکار (Auto)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <div class="flex mt-4 space-x-6">
      <Power :class="wifiActive ? 'text-green-500' : 'text-red-500'" class="w-8 h-8" />
      <PersonStanding v-if="sensorActive" class="w-8 h-8 text-blue-500" />
      <CircleOff v-else class="w-8 h-8 text-gray-400" />
    </div>
  </div>
</template>

