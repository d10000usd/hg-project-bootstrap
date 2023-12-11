<template>
  <div>
    <div ref="chartContainer" id="chartContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatedFetchCandle } from "../../ts/commonstatic";
import { createChart } from 'lightweight-charts';

const dwmCandle0 = ref({
  "ticker": "KRW-BTC",
  "candlecnt": 23,
  "timeInterval": "minute240",
  "weightValue": 3.1
});

const ohlc = ref();

const fetchCandleData = async () => {
  ohlc.value = await formatedFetchCandle(
    dwmCandle0.value.types,
    dwmCandle0.value.ticker,
    dwmCandle0.value.candlecnt,
    dwmCandle0.value.timeInterval,
  );

  // Call a function to create and render the candlestick chart
  createCandlestickChart(ohlc.value);
};

onMounted(() => {
  // Fetch candle data when the component is mounted
  fetchCandleData();
});

const createCandlestickChart = (candleData) => {
  const chart = createChart(document.getElementById('chartContainer'), {
    width: 800,
    height: 400,
    localization: {
      timeFormatter: (businessDay) => {
        return new Date(businessDay * 1000).toLocaleDateString();
      },
    },
  });

  const candleSeries = chart.addCandlestickSeries();

  // Add candlestick data to the series
  candleSeries.setData(candleData);
};
</script>
