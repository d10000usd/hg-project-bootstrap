<template>
  <div class="c-custom-card">
    <h3>{{ dwmCandle0 }}</h3><br>
    <br>
    <br>
    <div ref="chartContainer10">
      <div class="spacing mb-21"></div>
    </div>
    <button @click="fetchCandleData">Fetch Candle Data</button>
    <button @click="processData">Process Data</button>
  </div>
</template>

    <script setup>
    import { ChartLogic } from '../../ts/ChartLogic';
    import { onMounted, ref, defineProps, reactive } from 'vue';
    import { formatedFetchCandle, cal } from '../../ts/commonstatic';
    import chartOptions from "@/assets/coinInfo/chartOptions.json";
    

    const dwmCandle0 = ref({
      "ticker": "KRW-HBAR", "candlecnt": 23, "timeInterval": "minute240", "weightValue": 3 
    });
    const chartContainer10 = ref(null);
    const ohlc = ref();
    const guidline = ref();
    const weightValue = 3;
    const fetchCandleData = async () => {
  ohlc.value = await formatedFetchCandle(
    dwmCandle0.value.types,
    dwmCandle0.value.ticker,
    dwmCandle0.value.candlecnt,
    dwmCandle0.value.timeInterval,
  );
 
};


const processData = async () => {
  if (ohlc.value) {
    guidline.value = await cal(ohlc.value, weightValue);
    const chartLogic = new ChartLogic(chartOptions, dwmCandle0, chartContainer10, ohlc.value, guidline.value);
    chartLogic.initializeChart();
  } else {
    // Handle the case where ohlc.value is not available yet
    console.error("Candle data not available. Fetch data first.");
  }
};
</script>