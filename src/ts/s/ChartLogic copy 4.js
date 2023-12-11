// ChartLogic.js
import { createChart } from "lightweight-charts";
import { ref, watch } from 'vue';
import { formatedFetchCandle } from "./commonstatic";

class ChartLogic {
  constructor(chartOptions, candleType, chartContainer,ohlcdata) {
    this.chartOptions = chartOptions;
    this.candleType = candleType;
    this.chartContainer = chartContainer;
    this.chart = null;
    this.ohlcdata = ohlcdata
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
    const { children } = this.chartContainer.value;
    if (children.length > 0) {
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
    this.chart.addCandlestickSeries({
      priceLineVisible: false,
      priceScale: { position: 'left' },
    });
  }

  addTickerTextElement() {
    const tickerTextElement = document.createElement('div');
    const { ticker, candlecnt, timeInterval } = this.candleType;
    tickerTextElement.textContent = `Ticker: ${ticker}  ${candlecnt} ${timeInterval} `;
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
      
      );

      const series = this.chart.addCandlestickSeries({
        priceLineVisible: false,
        priceScale: { position: 'left' },
      });
      // ohlc = this.ohlcdata
      series.setData(ohlc);
      this.setDataAndMarkersForStLine(series,ohlc)
      this.updateChartWithAnalysisData(series, ohlc);
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }
  }

  updateChartWithAnalysisData(series, ohlc) {
    this.addMovingAverages(series, ohlc);
    // this.addPriceLine(series, ohlc);
    // this.addStLine(series, ohlc);
    // this.addMarker(series, ohlc)
  }

  addPriceLine(series, ohlc) {
    series.createPriceLine({
      price: 29.0,
      color: 'black',
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'P/L 500',
    });
  }

  addStLine(series) {
    const maSeries1 = this.chart.addLineSeries({
      price: 32,
      color: "#ef5350",
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: "",
      textAlign: "left"
    });

    // this.setDataAndMarkersForStLine(maSeries1);
  }

  setDataAndMarkersForStLine(series,specificMovingAverageData) {
    const data1= [
      { time: 1700771000, value: 30.472307692307695 },
      { time: 1700776800, value: 30.467692307692307 },
      { time: 1700780400, value: 30.46769230769231 },
      { time: 1700784000, value: 31.464615384615385 }
    ];

    series.setData(specificMovingAverageData);

    series.setMarkers([
      {
        time: 1700771000,
        position: 'aboveBar',
        color: 'black',
        shape: 'arrowDown',
        size: 4,
      },
      {
        time: 1700784000,
        position: 'aboveBar',
        color: 'red',
        shape: 'arrowDown',
        id: 'id4',
        size: 4,
      },
    ]);
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
      maSeries.setData(specificMovingAverageData);
      
    }
    
  }
  
}

export { ChartLogic };
