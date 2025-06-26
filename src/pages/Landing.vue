<script lang="ts" setup>
import StatsComponent from "@/components/StatsComponent.vue";
import ChartComponent from "@/components/ChartComponent.vue";
import Header from "@/components/Header.vue";
import Device from "@/components/Device.vue";
import { ref, onMounted } from "vue";
import { getDevices, getOnlineDevices, getStats } from "@/lib/api";
import { toast } from "vue-sonner";
import { stringifyQuery } from "vue-router";

let status_data = ref(0);

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
  }[]
>([]);

async function fetchData() {
  try {
    const allDevices = await getDevices();
    devices.value = allDevices.map((d: any, index: number) => ({
      title: d.mac_address || `Device ${index + 1}`,
      code: d.mac_address || index + 1,
      wifiActive: d.status, // or infer from `onlineResponse`
      sensorActive: d.is_enabled,
    }));

    stats.value.OnDevices = allDevices.response?.length?.toString() || "0";
    stats.value.OffDevices = (
      allDevices.length - parseInt(stats.value.OnDevices)
    ).toString();
  } catch (err) {
    console.error("📡 Failed to fetch dashboard data", err);
  }
}

// Interval ID so we can clean it up
let intervalId: number;

intervalId = setInterval(async () => {
  await all();
}, 5000);

async function ping() {
  try {
    const res = await getOnlineDevices();
    console.log(res.data);
  } catch (error) {
    console.log(error);
    status_data.value = 2;
    toast.error("مشکلی در دستگاه ریموت پیش آمد");
  }
}

async function all() {
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
  } catch (error) {
    status_data.value = 2;
    toast.error("مشکلی در دستگاه آمار پیش آمد");
    console.log(error);
  }
  await ping();
  await fetchData();

  status_data.value = 1;
}

onMounted(async () => {
  await all();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <Header :server="status_data" class="h-[15vh] mb-6"></Header>
    <main
      class="grid grid-cols-10 grid-rows-10 gap-4 grid-flow-row-dense h-[75dvh]"
    >
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="روشنایی آثار فعال"
          :value="stats.OnDevices"
          :prefix="stats.OffDevices + '/'"
          :right="false"
        />
      </div>
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="ساعت های پیک"
          :value="stats.mostActiveHours"
          :right="false"
          prefix="بازه"
        />
      </div>
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="میانگین تماشای
بازدید کننده ها از آثار"
          :value="stats.avgViewerTime"
          prefix="ثانیه"
          :right="true"
        />
      </div>
      <div
        class="col-span-4 row-span-10 bg-white shadow-lg rounded-lg p-4 grid grid-cols-3 grid-rows-8"
      >
        <Device
          v-for="device in devices"
          :title="device.title"
          :code="device.code"
          :current-mode="device.wifiActive"
          :sensor-active="device.sensorActive"
          :wifi-active="
            device.wifiActive == 'auto'
              ? device.sensorActive
              : device.wifiActive == 'on'
          "
          class="col-span-1 row-span-2 rounded-xl"
        ></Device>
      </div>
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="اثر پر بازدید امروز"
          :value="stats.bestDevice"
          prefix="اثر شماره"
        />
      </div>
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="اثر کم بازدید امروز"
          :value="stats.worstDevice"
          prefix="اثر شماره"
        />
      </div>
      <div class="col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-4">
        <StatsComponent
          title="زمان تماشای کل آثار امروز"
          :value="stats.minWatchedTotal"
          prefix="دقیقه"
          :right="true"
        />
      </div>
      <div class="col-span-6 row-span-6 bg-white shadow-lg rounded-lg p-4">
        <ChartComponent />
      </div>
    </main>
  </div>
</template>
