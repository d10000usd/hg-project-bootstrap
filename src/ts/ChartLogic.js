// ChartLogic.js
import { createChart } from "lightweight-charts";
import { ref, watch } from 'vue';
import { formatedFetchCandle } from "./commonstatic";

class ChartLogic {
  constructor(chartOptions, candleType, chartContainer,ohlcdata,guidline) {
    this.chartOptions = chartOptions;
    this.candleType = candleType;
    this.chartContainer = chartContainer;
    this.chart = null;
    this.ohlcdata = ohlcdata;
    this.guidline = guidline
  }

  async initializeChart() {
    if (!this.chartContainer.value) {
      console.error("Chart container is not defined.");
      return;
    }


    this.clearChartContainer();
    this.createChartInstance();
    this.addCandlestickSeries();
    this.chart.applyOptions({
      ...this.chartOptions,
      grid: {
          vertLines: false,
          horzLines: false,
      },
      priceScale: {
        mode: this.candleType === 'ohlc' ? 0 : 1,
        visible: true, // Set visible to true to show all candles
      },
  });

    this.addTickerTextElement();

    try {
      await this.formatedFetchAndUpdateCandle();
    } catch (error) {
      console.error("Error fetching candle data:", error);
    }

    this.watchTickerChanges();
    // Set visible range to show all candles
  const firstDataTimestamp = this.ohlcdata[0].time;
  const lastDataTimestamp = this.ohlcdata[this.ohlcdata.length - 1].time;
  this.chart.timeScale().setVisibleRange({ from: firstDataTimestamp, to: lastDataTimestamp });
  }

  clearChartContainer() {
    const { children } = this.chartContainer.value;
    if (children.length > 0) {
      this.chartContainer.value.innerHTML = '';
    }
  }

  createChartInstance() {
    // Create the chart with an initial width
    this.chart = createChart(this.chartContainer.value, {
      width: this.chartContainer.value.clientWidth, // Set initial width based on container
      height: 400,
    });
  
    // Resize the chart when the window is resized
    window.addEventListener('resize', () => {
      this.chart.applyOptions({
        width: this.chartContainer.value.clientWidth,
      });
    });
  }
  

  addCandlestickSeries() {
    this.chart.addCandlestickSeries({
      priceLineVisible: false,
      priceScale: { position: 'right' },
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
      // const ohlc = await formatedFetchCandle(
      //   this.candleType.types,
      //   this.candleType.ticker,
      //   this.candleType.candlecnt,
      //   this.candleType.timeInterval,
      
      // );

      const series = this.chart.addCandlestickSeries({
        priceLineVisible: false,
        priceScale: { position: 'left' },
      });
      const ohlc = this.ohlcdata
      this.updateChartWithAnalysisData(series, ohlc);
      this.setAddGuidLine(series,ohlc)
      this.setDataAndMarkersForStLine(series,ohlc)
  
      series.setData(ohlc);
   

    } catch (error) {
      console.error("Error fetching candle data:", error);
    }
        
  }

  updateChartWithAnalysisData(series, ohlc) {
    this.addMovingAverages(series, ohlc);
    this.addPriceLine_average(series, ohlc);

    this.addPriceLine_maximum(series, ohlc);
    this.addPriceLine_minimum(series, ohlc);

  }

  addPriceLine_maximum(series, ohlc) {
    let op = this.chartOptions.lineOption.maxPriceLine
    op.price = this.guidline.maximum.value
 
    series.createPriceLine(
      op
    );
  }
  addPriceLine_minimum(series, ohlc) {
    let op = this.chartOptions.lineOption.minPriceLine
    op.price = this.guidline.minimum.value

    series.createPriceLine(
      op
    );
  }
  addPriceLine_average(series, ohlc) {
    let op = this.chartOptions.lineOption.avgPriceLine
    op.price = this.guidline.average.value

    series.createPriceLine(
      op
    );
  }

  setAddGuidLine(series, specificMovingAverageData) {
    const nonesort = [
      { time: this.guidline.maximum.time, value: this.guidline.maximum.value },
      { time: this.guidline.minimum.time, value: this.guidline.minimum.value },
      { time: this.guidline.average.time, value: this.guidline.average.value },
      { time: this.guidline.lastClose.time, value: this.guidline.lastClose.value },
    ];
    const vertical = [

      { time: this.guidline.average.time+0.0001, value: this.guidline.maximum.value},
      { time: this.guidline.average.time+0.0002, value: this.guidline.minimum.value},



    ];
  
    const sortedData = nonesort.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  
    // Extract the first two elements
    const firstTwo = nonesort.slice(0, 2);
    const midTwo = nonesort.slice(1, 3);
    const lastTwo = nonesort.slice(-2);
  
    const firstTwoColor = firstTwo[0].value > firstTwo[1].value ? 'black' : 'red';
    const midTwoColor = midTwo[0].value > midTwo[1].value ? 'blue' : 'yellow';
    const lastTwoColor = lastTwo[0].value > lastTwo[1].value ? 'blue' : 'red';
  
    const firstTwoSeries = this.chart.addLineSeries({
      color: firstTwoColor,
      lineWidth: 6,
    });
  
    const midTwoSeries = this.chart.addLineSeries({
      color: midTwoColor,
      lineWidth: 8,
    });
  
    const lastTwoSeries = this.chart.addLineSeries({
      color: lastTwoColor,
      lineWidth: 6,
    });
    const verticalSeries = this.chart.addLineSeries({
      color: lastTwoColor,
      lineWidth: 6,
    });
  
    firstTwoSeries.setData(firstTwo);
    midTwoSeries.setData(midTwo);  // Fixed typo: changed midTwoColor to midTwoSeries
    lastTwoSeries.setData(lastTwo);
    // verticalSeries.setData(vertical);
  }
  
  setDataAndMarkersForStLine(series,specificMovingAverageData) {

    series.setData(specificMovingAverageData);

    let nonesort= [
      {
        time: this.guidline.maximum.time,
        position: 'aboveBar',
        color: 'red',
        shape: 'arrowDown',
        id: 'id4',
        text: 'max @ ' + this.guidline.maximum.value,
        size: 4,
      },
      {
        time: this.guidline.minimum.time,
        position: 'belowBar',
        color: 'black',
        shape: 'arrowUp',
        text: 'min @  ' + this.guidline.minimum.value,
        size: 4,
      },
      {
        time: this.guidline.lastClose.time,
        position: 'belowBar',
        color: 'green',
        shape: 'arrowUp',
        text: '클로즈 @  ' + this.guidline.lastClose.value,
        size: 4,
      }

    ]



    const sortedData1 = nonesort.sort((a, b) => a.time - b.time);


    series.setMarkers(nonesort);

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
  addSMALine(specificMovingAverageData,value){
    const maSeries = this.chart.addLineSeries({
      color: value.color,
      lineWidth: value.lineWidth,
      priceLineVisible: value.priceLineVisible === "true",
    });

    maSeries.setData(specificMovingAverageData);
  }

  addMovingAverages(series, ohlc) {
    for (const [key, value] of Object.entries(this.chartOptions.movingAverages)) {
      const dayValue = parseInt(key.replace('ma', ''), 10);
      const specificMovingAverageData = this.calculateMovingAverage(ohlc, dayValue);

      this.addSMALine(specificMovingAverageData,value)

      
    }
    
  }
  
}

export { ChartLogic };
