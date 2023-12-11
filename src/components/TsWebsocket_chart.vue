<template>
<div  class=" c-custom-card ">
  <h3>{{ dwmCandle0 }}</h3>
  <div ref="chartContainer0">
    <div class="spacing mb-21">

    </div>
</div>

</div>

</template>

<script setup>
import { ChartLogic } from '../ts/ChartLogic';
import { onMounted, ref, defineProps, reactive } from 'vue';
import { formatedFetchCandle, cal } from '../ts/commonstatic';
import chartOptions from "@/assets/coinInfo/chartOptions.json";

const props = defineProps({
  message: Object,
  pncounts: Number,
});

const config = ref(props.message ? { ...props.message } : {});
const dwmCandle0 = reactive({
  "types": config.value.type,
  "ticker": config.value.ticker,
  "candlecnt": config.value.candlecnt,
  "timeInterval": config.value.timeInterval,
  "weightValue": config.value.weightValue
});
const chartContainer0 = ref(null);
const ohlc = ref();
const guidline = ref();
const weightValue = config.value.weightValue;

onMounted(async () => {
  ohlc.value = await formatedFetchCandle(
    config.value.type,
    config.value.ticker,
    config.value.candlecnt,
    config.value.timeInterval,
  );
  guidline.value = await cal(ohlc.value, weightValue);
  const chartLogic = new ChartLogic(chartOptions, dwmCandle0, chartContainer0, ohlc.value, guidline.value);
  chartLogic.initializeChart();
});
</script>