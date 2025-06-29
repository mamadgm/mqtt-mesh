<script setup lang="ts">
import { computed, ref } from "vue";
import { Line } from "@unovis/ts";
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

type Data = { hour: number; avgValue: number };

const props = defineProps<{
  mydata: Data[];
}>();

const x = (d: Data) => d.hour;

const minValue = computed(() => {
  const values = props.mydata.map(d => d.avgValue);
  const min = Math.min(...values);
  return min - 2;
});

const maxValue = computed(() => {
  const values = props.mydata.map(d => d.avgValue);
  const max = Math.max(...values);
  return max + 2;
});

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
  <Card class="font-yekan">
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
          :data="mydata"
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
