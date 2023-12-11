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
  
    if (this.chartContainer.value.children.length > 0) {
      this.chartContainer.value.innerHTML = '';
    }
  
    this.chart = createChart(this.chartContainer.value, {
      width: 390,
      height: 300,
    });
  
    const candlestickSeries = this.chart.addCandlestickSeries({
      priceLineVisible: false,
      priceScale: {
        position: 'left',
      },
    });

    this.chart.applyOptions(this.chartOptions);

    const tickerTextElement = document.createElement('div');
    tickerTextElement.textContent = `Ticker: ${this.candleType.candlecnt} ${this.candleType.timeInterval} `;
    this.chartContainer.value.appendChild(tickerTextElement);

    try {
      await this.formatedFetchAndUpdateCandle(candlestickSeries);
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }

    watch(() => this.candleType.ticker, async (newValue, oldValue) => {
      if (oldValue && oldValue.length >= 3 && newValue !== oldValue) {
        this.chart.remove();
        this.chart = createChart(this.chartContainer.value, {
          width: 390,
          height: 300,
        });
        const newCandlestickSeries = this.chart.addCandlestickSeries({
          priceLineVisible: false,
          priceScale: {
            position: 'left',
          },
        });

        const newTickerTextElement = document.createElement('div');
        newTickerTextElement.textContent = `Tickerssss: ${this.candleType} ${this.candleType}`;
        this.chartContainer.value.appendChild(newTickerTextElement);

        try {
          await this.formatedFetchAndUpdateCandle(newCandlestickSeries);
        } catch (error) {
          console.error("Error fetching candle data:", error);
        }
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

  async formatedFetchAndUpdateCandle(series) {
    try {
      const ohlc = await formatedFetchCandle(
        this.candleType.types,
        this.candleType.ticker,
        this.candleType.candlecnt,
        this.candleType.timeInterval,
        this.candleType.minType
      );

      series.setData(ohlc);

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
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }
  }
}

export {  ChartLogic };
