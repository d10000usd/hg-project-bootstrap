// ChartLogic.js
import { createChart } from "lightweight-charts";
import { ref, watch, reactive } from 'vue';
import { formatedFetchCandle } from "./commonstatic"
export function useChartLogic(chartOptions, candleType, chartContainer) {
  let chart;

  const initializeChart = async () => {
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

    const tickerTextElement = document.createElement('div');
    tickerTextElement.textContent = `Ticker: ${candleType.candlecnt} ${candleType.timeInterval} `;
    chartContainer.value.appendChild(tickerTextElement);

    try {
      await formatedFetchAndUpdateCandle(chart, candlestickSeries, candleType);
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }

    watch(() => candleType.ticker, async (newValue, oldValue) => {
      if (oldValue && oldValue.length >= 3 && newValue !== oldValue) {
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

        const newTickerTextElement = document.createElement('div');
        newTickerTextElement.textContent = `Tickerssss: ${candleType} ${candleType}`;
        chartContainer.value.appendChild(newTickerTextElement);

        try {
          await formatedFetchAndUpdateCandle(chart, newCandlestickSeries, candleType);
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
  
  async function formatedFetchAndUpdateCandle(chart, series, candleType) {
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
  
  return { initializeChart };
}
