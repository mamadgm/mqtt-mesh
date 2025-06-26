<script setup lang="ts">
import { ref } from "vue";
import { CurveType, Line } from "@unovis/ts";
import {
  VisCrosshair,
  VisLine,
  VisScatter,
  VisTooltip,
  VisXYContainer,
} from "@unovis/vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Data = { hour: number; newValue: number; avgValue: number };

const data = ref<Data[]>([
  { hour: 0, newValue: 25, avgValue: 40 },
  { hour: 1, newValue: 32, avgValue: 20 },
  { hour: 2, newValue: 45, avgValue: 15 },
  { hour: 3, newValue: 15, avgValue: 30 },
  { hour: 4, newValue: 50, avgValue: 42 },
  { hour: 5, newValue: 10, avgValue: 15 },
  { hour: 6, newValue: 35, avgValue: 25 },
  { hour: 7, newValue: 28, avgValue: 36 },
  { hour: 8, newValue: 60, avgValue: 20 },
  { hour: 9, newValue: 20, avgValue: 40 },
  { hour: 10, newValue: 40, avgValue: 31 },
  { hour: 11, newValue: 30, avgValue: 42 },
  { hour: 12, newValue: 55, avgValue: 40 },
  { hour: 13, newValue: 15, avgValue: 25 },
  { hour: 14, newValue: 45, avgValue: 22 },
  { hour: 15, newValue: 25, avgValue: 30 },
  { hour: 16, newValue: 5, avgValue: 10 },
  { hour: 17, newValue: 35, avgValue: 32 },
  { hour: 18, newValue: 20, avgValue: 25 },
  { hour: 19, newValue: 40, avgValue: 35 },
  { hour: 20, newValue: 30, avgValue: 28 },
  { hour: 21, newValue: 15, avgValue: 20 },
  { hour: 22, newValue: 50, avgValue: 45 },
  { hour: 23, newValue: 5, avgValue: 8 },
]);

const x = (d: Data) => d.hour;

// Calculate dynamic y-axis range
const minValue = ref(
  Math.min(...data.value.map((d) => Math.min(d.newValue, d.avgValue))) - 2
);
const maxValue = ref(
  Math.max(...data.value.map((d) => Math.max(d.newValue, d.avgValue))) + 2
);

function template(d: Data) {
  return `
<div class="rounded-lg border bg-background p-2 shadow-sm">
  <div class="grid grid-cols-2 gap-2">
    <div class="flex flex-col">
      <span class="text-[0.70rem] uppercase text-black">ساعت</span>
      <span class="font-bold text-black">${d.hour}:00</span>
    </div>
    <div class="flex flex-col">
      <span class="text-[0.70rem] uppercase text-black">مقدار میانگین</span>
      <span class="font-bold text-black">${d.avgValue}</span>
    </div>
</div>`;
}

function computeLineOpacity(val: any, index: number) {
  return index === 0 ? "1" : "1";
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-black text-2xl">عملکرد 24 ساعته دستگاه</CardTitle>
      <CardDescription class="text-black text-xl">
        مقدار روشنایی تمام آثار در هر ساعت به صورت دقیقه
      </CardDescription>
    </CardHeader>
    <CardContent class="pb-4">
      <div class="h-[200px]">
        <VisXYContainer
          height="200px"
          :data="data"
          :margin="{
            top: 3,
            right: 3,
            left: 3, // Increased left margin for y-axis labels
            bottom: 3, // Added bottom margin for x-axis labels
          }"
          :style="{
            '--vis-tooltip-padding': '0px',
            '--vis-tooltip-background-color': 'transparent',
            '--vis-tooltip-border-color': 'transparent',
            '--vis-background-color': '#ffffff',
          }"
          :yDomain="[minValue, maxValue]"
        >
          <VisTooltip />
          <!-- <VisLine
            :x="x"
            :y="(d: Data) => d.newValue"
            :lineWidth="4"
            color="#109384"
            :attributes="{
              [Line.selectors.linePath]: { opacity: computeLineOpacity },
            }"
          /> -->
          <VisLine
            :x="x"
            :y="(d: Data) => d.avgValue"
            :lineWidth="4"
            color="#CCAB66"
            :attributes="{
              [Line.selectors.linePath]: { opacity: computeLineOpacity },
            }"
          />
          <!-- <VisScatter
            :x="x"
            :y="(d: Data) => d.newValue"
            :size="2"
            :stroke-width="2"
            stroke-color="#109384"
            color="#109384"
          /> -->
          <VisScatter
            :x="x"
            :y="(d: Data) => d.avgValue"
            :size="8"
            :stroke-width="4"
            stroke-color="#CCAB66"
            color="#FF0000"
          />
          <VisCrosshair :template="template" />
        </VisXYContainer>
      </div>
    </CardContent>
  </Card>
</template>
