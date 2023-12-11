<template>
  <body class="body-full">
    <div class="spacing mb-11">
      <div class="c-custom-card">
        <p>Received Message: {{ data[message] }}</p>
        <div ref="chartContainer0"></div>
        <div ref="chartContainer1"></div>
        <div ref="chartContainer2"></div>
        <div ref="chartContainer3"></div>
        
      </div>

    </div>
  </body>
</template>

<script setup>


import { useWebSocketLogic } from '../stores/WebsocketConnector';

const { sortedWsData: data } = useWebSocketLogic([message], "TsWebsocket_Report",'signed_change_rate',"asc");

import { createChart } from "lightweight-charts";
import chartOptions from "@/assets/coinInfo/chartOptions.json";

import { onMounted, ref, defineProps, watch, reactive } from 'vue';
import { formatedFetchCandle } from '../ts/commonstatic';
const { message } = defineProps(['message']);


//months,weeks,days
// 분 단위. 가능한 값 : minute1, 3, 5, 15, 10, 30, 60, 240
// 캔들 개수(최대 200개까지 요청 가능)
const dwmCandle0 = reactive({
  "types": 'candle',
  "ticker": message,
  "candlecnt": 30,
  "timeInterval": 'days',

});
const dwmCandle1 = reactive({
  "types": 'candle',
  "ticker": message,
  "candlecnt": 54,
  "timeInterval": 'weeks',

});
const dwmCandle2 = reactive({
  "types": 'candle',
  "ticker": message,
  "candlecnt": 24,
  "timeInterval": 'months',

});
const minutesCandle = reactive({
  "types": 'candle',
  "ticker": message,
  "candlecnt": 330,
  "timeInterval": 'minute240',

});




const chartContainer0 = ref(null);
const chartContainer1 = ref(null);
const chartContainer2 = ref(null);
const chartContainer3 = ref(null);
let chart;
const initializeChart = async (chartOptions,chartContainer,candleType) => {
  // Check if chart is already initialized, if yes, then remove it
  if (chartContainer.value && chartContainer.value.children.length > 0) {
    chartContainer.value.innerHTML = '';
  }
  chart = createChart(chartContainer.value, {
    width: 390,
    height: 300,
  });

  const candlestickSeries = chart.addCandlestickSeries({
    priceLineVisible: false,
    priceScale: {
      position: 'left',
    },
  });

  chart.applyOptions(chartOptions);

  // Add a text element to display the ticker
  const tickerTextElement = document.createElement('div');
  tickerTextElement.textContent = `Ticker: ${candleType.candlecnt} ${candleType.timeInterval} `;
  chartContainer.value.appendChild(tickerTextElement);

  try {
    // Fetch and update data initially based on the tt values
    await formatedFetchAndUpdateCandle(chart, candlestickSeries,candleType);

  } catch (error) {
    console.error("Error fetching candle data:", error);
  }

  // Watch for changes in tt.ticker and update the chart
  watch(() => candleType.ticker, async (newValue, oldValue) => {
    if (oldValue && oldValue.length >= 3 && newValue !== oldValue) {
      // Clear and redraw the chart when tt.ticker changes
      chart.remove();
      chart = createChart(chartContainer.value, {
        width: 390,
        height: 300,
      });
      const newCandlestickSeries = chart.addCandlestickSeries({
        priceLineVisible: false,
        priceScale: {
          position: 'left',
        },
      });

      // Add a new text element with the updated ticker
      const newTickerTextElement = document.createElement('div');
      newTickerTextElement.textContent = `Tickerssss: ${candleType} ${candleType}`;
      chartContainer.value.appendChild(newTickerTextElement);

      try {
        // Fetch and update data based on the new tt.ticker value
        await formatedFetchAndUpdateCandle(chart, newCandlestickSeries,candleType);

      } catch (error) {
        console.error("Error fetching candle data:", error);
      }
    }
  });
};

function calculateMovingAverage(data, period) {
  const movingAverage = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - (period - 1), i + 1).reduce((acc, curr) => acc + curr.close, 0);
    const average = sum / period;

    movingAverage.push({
      time: data[i].time,
      value: average,
    });
  }

  return movingAverage;
}


async function formatedFetchAndUpdateCandle(chart, series,candleType) {
  try {
    const ohlc = await formatedFetchCandle(
      candleType.types,
      candleType.ticker,
      candleType.candlecnt,
      candleType.timeInterval,
      candleType.minType
    );

    // Calculate 5-day moving average
    // const movingAverageData = calculateMovingAverage(ohlc, 5);

    // Set data for candlestick series
    series.setData(ohlc);

    // Loop through the keys and values of movingAverages
    for (const [key, value] of Object.entries(chartOptions.movingAverages)) {
      // Extract the day value from the key (e.g., 'ma95' -> 95)
      const dayValue = parseInt(key.replace('ma', ''), 10);

      const maSeries = chart.addLineSeries({
        color: value.color,
        lineWidth: value.lineWidth,
        priceLineVisible: value.priceLineVisible === "true", // Convert string to boolean
      });

      // Calculate the moving average for the specific day value
      const specificMovingAverageData = calculateMovingAverage(ohlc, dayValue);

      // Set data for the specific moving average series
      maSeries.setData(specificMovingAverageData);
    }
  } catch (error) {
    console.error("Error fetching candle data:", error);
  }
}


onMounted(() => initializeChart(chartOptions,chartContainer0,dwmCandle0));
onMounted(() => initializeChart(chartOptions,chartContainer1,dwmCandle1));
onMounted(() => initializeChart(chartOptions,chartContainer2,dwmCandle2));
onMounted(() => initializeChart(chartOptions,chartContainer3,minutesCandle));
</script>
