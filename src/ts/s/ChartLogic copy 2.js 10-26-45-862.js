// ChartLogic.js
import { createChart } from "lightweight-charts";
import { ref, watch } from 'vue';
import { formatedFetchCandle } from "./commonstatic";

class ChartLogic {
  constructor(chartOptions, candleType, chartContainer) {
    this.chartOptions = chartOptions;
    this.candleType = candleType;
    this.chartContainer = chartContainer;
    this.chart = null;
  }

  async initializeChart() {
    if (!this.chartContainer.value) {
      console.error("Chart container is not defined.");
      return;
    }

    this.clearChartContainer();
    this.createChartInstance();
    this.addCandlestickSeries();
    this.chart.applyOptions(this.chartOptions);
    this.addTickerTextElement();

    try {
      await this.formatedFetchAndUpdateCandle();
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }

    this.watchTickerChanges();
  }

  clearChartContainer() {
    if (this.chartContainer.value.children.length > 0) {
      this.chartContainer.value.innerHTML = '';
    }
  }

  createChartInstance() {
    this.chart = createChart(this.chartContainer.value, {
      width: 630,
      height: 380,
    });
  }

  addCandlestickSeries() {
    const candlestickSeries = this.chart.addCandlestickSeries({
      priceLineVisible: false,
      priceScale: {
        position: 'left',
      },
    });
  }

  addTickerTextElement() {
    const tickerTextElement = document.createElement('div');
    tickerTextElement.textContent = `Ticker: ${this.candleType.ticker}  ${this.candleType.candlecnt} ${this.candleType.timeInterval} `;
    this.chartContainer.value.appendChild(tickerTextElement);
  }

  watchTickerChanges() {
    watch(() => this.candleType.ticker, async (newValue, oldValue) => {
      if (oldValue && oldValue.length >= 3 && newValue !== oldValue) {
        this.chart.remove();
        this.initializeChart();
      }
    });
  }

  calculateMovingAverage(data, period) {
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

  async formatedFetchAndUpdateCandle() {
    try {
      const ohlc = await formatedFetchCandle(
        this.candleType.types,
        this.candleType.ticker,
        this.candleType.candlecnt,
        this.candleType.timeInterval,
        this.candleType.minType
      );

      const series = this.chart.addCandlestickSeries({
        priceLineVisible: false,
        priceScale: {
          position: 'left',
        },
      });

      series.setData(ohlc);
      // this.addMovingAverages(series, ohlc);
      this.addPriceLine(series, ohlc)
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }
  }
  addPriceLine(series, ohlc) {

   let p = {    'maxPriceLine': {
      'price': 32,
      'color': '#26a69a',
      'lineWidth': 12,
      'lineStyle': 2, // LineStyle.Dashed
      'axisLabelVisible': true,
      'title': '최고가',
      'textAlign': 'left',
    }}
    const maSeries1 = this.chart.addLineSeries({
      p 
    });
    maSeries1.setData([
 
      {time: 170073200, value: 30.472307692307695},
  
      {time: 1700776800, value: 30.467692307692307},

      {time: 1700780400, value: 30.46769230769231},

      {time: 1700784000, value: 30.464615384615385}
      ]);
    // maSeries.setData(specificMovingAverageData);
  }


  
  addMovingAverages(series, ohlc) {
    for (const [key, value] of Object.entries(this.chartOptions.movingAverages)) {
      const dayValue = parseInt(key.replace('ma', ''), 10);

      const maSeries = this.chart.addLineSeries({
        color: value.color,
        lineWidth: value.lineWidth,
        priceLineVisible: value.priceLineVisible === "true",
      });

      const specificMovingAverageData = this.calculateMovingAverage(ohlc, dayValue);
      console.log(specificMovingAverageData)
      maSeries.setData(specificMovingAverageData);
    }
  }
}

export { ChartLogic };
