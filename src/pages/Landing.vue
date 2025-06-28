<script lang="ts" setup>
import StatsComponent from "@/components/StatsComponent.vue";
import ChartComponent from "@/components/ChartComponent.vue";
import Header from "@/components/Header.vue";
import Device from "@/components/Device.vue";
import { ref, onMounted, type ComponentPublicInstance } from "vue";
4;
const deviceRefs = ref<
  Record<
    string,
    ComponentPublicInstance<{ updateState: (state: string) => void }> | null
  >
>({});
import { getDevices, getOnlineDevices, getStats, sendCommand } from "@/lib/api";
import { toast } from "vue-sonner";

type Data = { hour: number; avgValue: number };

const mydata = ref<Data[]>([]);
const status_data = ref(0);
const isLoading = ref(false);
const isError = ref(false);

const stats = ref({
  OnDevices: "0",
  OffDevices: "0",
  mostActiveHours: "17-20",
  avgViewerTime: "65",
  bestDevice: "3",
  worstDevice: "78",
  minWatchedTotal: "580",
});

const devices = ref<
  {
    title: string;
    code: number;
    wifiActive: string;
    sensorActive: boolean;
    online: boolean; // New property
  }[]
>([]);

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

// Schedules next data refresh after 20s
function scheduleStatsUpdate() {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(async () => {
    await all();
  }, 20000);
}

const updateState = async (
  newState: string,
  oldstate: string,
  code: number
) => {
  if (oldstate === newState) return;
  try {
    const res = await sendCommand(String(code), { command: newState });
    setTimeout(() => {
      all();
      scheduleStatsUpdate();
    }, 1000);
  } catch (err) {
    console.error("❌ Command failed:", err);
  }
};

async function fetchData() {
  try {
    const allDevices = await getDevices();
    const onlineDevices = await getOnlineDevices();
    console.log("allDevices", allDevices);
    console.log("onlineDevices", onlineDevices);

    // Step 1: Parse the response
    const onlineTree = JSON.parse(onlineDevices.response);

    // Step 2: Flatten all nodeIds recursively
    const extractNodeIds = (node: any): number[] => {
      let ids: number[] = [node.nodeId];
      if (node.subs && Array.isArray(node.subs)) {
        for (const sub of node.subs) {
          ids.push(...extractNodeIds(sub));
        }
      }
      return ids;
    };

    const onlineNodeIds = extractNodeIds(onlineTree);
    console.log("✅ Online Node IDs:", onlineNodeIds);

    // Step 3: Map all devices and check if each mac_address exists in onlineNodeIds
    devices.value = allDevices.map((d: any, index: number) => ({
      title: d.name || `Device ${index + 1}`,
      code: d.mac_address || index + 1,
      wifiActive: d.status,
      sensorActive: d.is_enabled,
      online: onlineNodeIds.includes(Number(d.mac_address)),
    }));

    // Optional: update your stats
    stats.value.OffDevices = allDevices.length.toString();
  } catch (err) {
    console.error("❌ Failed to fetch devices:", err);
  }
}

async function all() {
  isLoading.value = true;
  status_data.value = 0;
  try {
    const res = await getStats();

    stats.value.OnDevices = res.data.active_device_count;
    stats.value.mostActiveHours = res.data.peak_range;
    stats.value.avgViewerTime = res.data.avg_watch_time_sec;
    stats.value.minWatchedTotal = String(
      parseFloat((res.data.total_watch_time_today / 60).toFixed(1))
    );
    stats.value.bestDevice = res.data.most_viewed_device_id;
    stats.value.worstDevice = res.data.least_viewed_device_id;

    const watchTimes = res.data.watch_time_per_hour;
    mydata.value = watchTimes.map((value: number, hour: number) => ({
      hour,
      avgValue: value,
    }));

    await fetchData();

    isError.value = false;
    status_data.value = 1;
  } catch (error) {
    if (!isError.value) {
      toast.error("مشکلی در ارتباط با سرور پیش آمد");
      console.error("❌ Stats fetch failed:", error);
    }
    isError.value = true;
    status_data.value = 2;
  } finally {
    isLoading.value = false;
    scheduleStatsUpdate();
  }
}

// Run once on mount
onMounted(async () => {
  await all();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 font-[yekan]">
    <div class="hidden lg:block">
      <Header
        :server="status_data"
        :loading="isLoading"
        class="h-[15vh] mb-6 font"
      />
    </div>
    <main
      class="grid grid-cols-10 grid-rows-10 gap-4 grid-flow-row-dense h-[75dvh]"
    >
      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="روشنایی آثار فعال"
          :value="stats.OnDevices"
          :prefix="stats.OffDevices + '/'"
          :right="false"
        />
      </div>

      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="ساعت های پیک"
          :value="stats.mostActiveHours"
          :right="false"
          prefix="بازه"
        />
      </div>

      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="میانگین تماشای
بازدید کننده ها از آثار"
          :value="stats.avgViewerTime"
          prefix="ثانیه"
          :right="true"
        />
      </div>
      <div
        class="col-span-10 row-span-10 lg:col-span-4 lg:row-span-10 bg-white shadow-lg rounded-lg p-3 grid lg:grid-cols-3 lg:grid-rows-8 grid-cols-2 grid-rows-6"
      >
        <Device
          v-for="device in devices"
          :title="device.title"
          :code="device.code"
          :online="device.online"
          :current-mode="device.wifiActive"
          :sensor-active="device.sensorActive"
          :wifi-active="
            device.wifiActive == 'auto'
              ? device.sensorActive
              : device.wifiActive == 'on'
          "
          class="col-span-1 row-span-2 rounded-xl"
          :run-parent="
            (newState) => updateState(newState, device.wifiActive, device.code)
          "
        />
      </div>

      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="اثر پر بازدید امروز"
          :value="stats.bestDevice"
          prefix="اثر شماره"
        />
      </div>

      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="اثر کم بازدید امروز"
          :value="stats.worstDevice"
          prefix="اثر شماره"
        />
      </div>

      <div
        class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-3 hidden lg:block"
      >
        <StatsComponent
          title="زمان تماشای کل آثار امروز"
          :value="stats.minWatchedTotal"
          prefix="دقیقه"
          :right="true"
        />
      </div>
      <div
        class="bg-white shadow-lg rounded-lg p-3 hidden lg:block col-span-6 row-span-6"
      >
        <ChartComponent :mydata="mydata" />
      </div>
    </main>
  </div>
</template>
