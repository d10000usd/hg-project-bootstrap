<template>
  <div class="">
    <div class="col-12">

      </div>
     
    <div class="row">
      <div class="col">
        <ul class="container-xl">
   <hr>
   

          <h1 :class="{ 'changed-up': isIncreased, 'changed-down': isDecreased }">{{ tt.ticker }}</h1>
          <div v-if="wsdata && wsdata.signed_change_rate" :class="{ 'changed-up': isIncreased, 'changed-down': isDecreased }">Types: {{ tt.types }}</div>
          <div v-if="wsdata && wsdata.signed_change_rate" :class="{ 'changed-up': isIncreased, 'changed-down': isDecreased }">Rate:   {{ wsdata.signed_change_rate * 100 }}  </div>
          <div  v-if="wsdata && wsdata.signed_change_rate" :class="{ 'changed-up': isIncreased, 'changed-down': isDecreased }">Trade Price: {{ newOhlcData.trade_price }}</div>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <apexchart type="candlestick" :options="chartOptions" :series="chartSeries" />
      </div>
    </div>
  </div>
  <br><br>
  <hr>
  <StaticView/>>
  <RouteButton :message="3" />
</template>

<script setup>
import { ref, onMounted ,watch} from 'vue';

import RouteButton from "../ts/RouteButton.vue"
import StaticView from '../views/StaticView.vue';



const props = defineProps({
  message: Object,
});
// const tic=ref(Object.assign({}, props.message.ticker))
const tt = ref({
  types: props.message.types,
  ticker: props.message.ticker,
  candlecnt: props.message.candlecnt,
  timeInterval: props.message.timeInterval,
});

const newOhlcData = ref({
  "candle_date_time_kst": 0,
  "opening_price": 0,
  "high_price": 0,
  "low_price": 0,
  "trade_price": 0,
});

// high_price 및 low_price의 이전 값을 저장하는 배열
const highPriceHistory = ref([]);
const lowPriceHistory = ref([]);
const wsdata = ref()
// WebSocket 데이터 처리 함수
const handleWebSocketMessageIn = async (payload) => {
  const data = await new Response(payload.data).json();
  wsdata.value =data
  const adjustedTimestamp = Math.floor(data.timestamp / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000);
  if (data.code == tt.value.ticker) {
    updateChartData(data, adjustedTimestamp);
    updateAnnotations();
    // console.log("WebSocket data received:", newOhlcData.value);
  }
};

const maxDataSize = 1; // 표시할 데이터의 최대 크기

const chartSeries = ref([
  {
    data: [],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'candlestick',
    height: 350,
    animations: {
      enabled: false,
    },
  },
  xaxis: {
    type: 'datetime',
  },
  // 다른 차트 옵션들...
  // 범례 설정 추가
  legend: {
    show: true, // 범례 표시 여부
    position: 'left', // 범례 위치 (top, right, bottom, left 중 선택)
  },
  // trade_price를 기준으로 가로선을 추가합니다.
  annotations: {
    
    yaxis: Array.from({ length: 6 }, () => ({
      y: 0, // 초기값 0으로 설정
      type: 'numeric', // y축의 값이
      borderColor: '#FF4560',
      label: {
        borderColor: '#FF4560',
        style: {
          show: true,       // y축 선 표시 여부
      color: '#999',    // y축 선 색상
      offsetX: 0,       // x축으로부터의 수평 오프셋
      offsetY: 0,       // y축으로부터의 수직 오프셋
      lineWidth: 2,     // y축 선의 굵기 설정
        },
        text: '', // 레이블은 빈 문자열로 초기화
      },
    })),


    
  },
  // 오르면 빨강색, 내리면 파랑색 설정
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#FF4560', // 오르면 빨강색
        downward: '#0070FF', // 내리면 파랑색
      },
    },
  },
});

// 차트 데이터 업데이트 함수
const updateChartData = (data, timestamp) => {
  newOhlcData.value = {
    "candle_date_time_kst": timestamp,
    "opening_price": data.opening_price,
    "high_price": data.high_price,
    "low_price": data.low_price,
    "trade_price": data.trade_price,
  };

  // high_price 및 low_price 값이 갱신될 때만 배열에 추가
  updatePriceHistory(newOhlcData.value.high_price, highPriceHistory);
  updatePriceHistory(newOhlcData.value.low_price, lowPriceHistory);

  // 차트 데이터 업데이트
  updateChartDataSeries(newOhlcData.value.candle_date_time_kst, [
    newOhlcData.value.opening_price,
    newOhlcData.value.high_price,
    newOhlcData.value.low_price,
    newOhlcData.value.trade_price,
  ]);
};

// 가로선의 y 값을 업데이트하는 함수
const updateAnnotations = () => {
  const annotations = chartOptions.value.annotations.yaxis;
  const ohlcData = newOhlcData.value;
  let trate= 1.012
  let brate=1.01
  // let tolerrance = ohlcData.low_price*0.01
  // 업데이트할 레이블, y 값, 및 색상 설정
  const labelAndYValues = [
    // { label: '[O]   ', y: ohlcData.opening_price, color: '#FF4560' }, // Opening Price의 색상
    // { label: '[H]   ', y: ohlcData.high_price, color: '#00FF00' }, // High Price의 색상
    // { label: '[L]   ', y: ohlcData.low_price, color: '#0000FF' }, // Low Price의 색상
    // { label: '[C] ', y: ohlcData.trade_price, color: '#FF00FF' }, // Trade Price의 색상
    // 새로운 가로선 1
    
    { label: '[trate] ', y: ohlcData.trade_price*trate, color: '#FFA500' }, // 색상을 원하는 대로 설정
    // 새로운 가로선 2
    { label: '[tolerrance] ', y:ohlcData.low_price, color: '#008080' }, // 색상을 원하는 대로 설정
    // 새로운 가로선 3
    { label: '[brate] ', y: ohlcData.trade_price*brate, color: '#800080' }, // 색상을 원하는 대로 설정
  ];
    annotations[0].lineWidth = 12;   // 첫 번째 y축 선의 굵기 설정
    annotations[1].lineWidth = 23;   // 두 번째 y축 선의 굵기 설정
    annotations[2].lineWidth = 34;   // 세 번째 y축 선의 굵기 설정
    annotations[3].lineWidth = 21;   // 네 번째 y축 선의 굵기 설정
    annotations[4].lineWidth = 12;   // 다섯 번째 y축 선의 굵기 설정
    annotations[5].lineWidth = 23; 

  for (let i = 0; i < labelAndYValues.length; i++) {
    annotations[i].y = labelAndYValues[i].y;
    annotations[i].label.text = labelAndYValues[i].label + labelAndYValues[i].y;

    // 가로선의 색상을 변경합니다.
    annotations[i].borderColor = labelAndYValues[i].color;
    annotations[i].label.style.background = labelAndYValues[i].color;
  }

  // 이전 값 업데이트
  updatePriceAnnotation(4, lowPriceHistory);
  updatePriceAnnotation(5, highPriceHistory);
};
// WebSocket 연결 설정 함수
const setupWebSocket = () => {
  try {
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    ws.onopen = () => {
      ws.send(
    

        JSON.stringify([
          { ticket: "test" },
          { type: 'ticker', codes: [tt.value.ticker] },
        ])
        
      );
      
    };
    ws.onclose = (e) => {
      console.error("WebSocket closed:", e);
    };

    ws.onmessage = handleWebSocketMessageIn;
  } catch (error) {
    console.error("Error fetching candle data:", error);
  }
};

// 초기화 함수
const initialize = () => {
  setupWebSocket();
};

// 컴포넌트 마운트 시 초기화 함수 호출
onMounted(initialize);

// 공통 함수: highPrice 또는 lowPrice를 업데이트하고 배열 크기를 관리합니다.
const updatePriceHistory = (price, priceHistory) => {
  if (price !== priceHistory.value[priceHistory.value.length - 1]) {
    priceHistory.value.push(price);
  }

  if (priceHistory.value.length > maxDataSize) {
    priceHistory.value.shift();
  }
};

// 공통 함수: 차트 데이터 업데이트
const updateChartDataSeries = (timestamp, yValues) => {
  if (chartSeries.value[0].data.length >= maxDataSize) {
    chartSeries.value[0].data.shift();
  }
  chartSeries.value[0].data.push({
    x: timestamp,
    y: yValues,
  });
};

// 공통 함수: 가로선의 y 값을 업데이트
const updatePriceAnnotation = (index, priceHistory) => {
  const annotations = chartOptions.value.annotations.yaxis;
  const lastPrice = priceHistory.value[priceHistory.value.length - 2];
  annotations[index].y = lastPrice;
  annotations[index].label.text = `[${index === 4 ? 'pl' : 'ph'}] ${lastPrice}`;
};

const prevTradePrice = ref(newOhlcData.value.trade_price);
const isIncreased = ref(false);
const isDecreased = ref(false);

watch(newOhlcData, () => {
  if (newOhlcData.value.trade_price > prevTradePrice.value) {
    isIncreased.value = true;
    isDecreased.value = false;
  } else if (newOhlcData.value.trade_price < prevTradePrice.value) {
    isIncreased.value = false;
    isDecreased.value = true;
  }

  prevTradePrice.value = newOhlcData.value.trade_price;

  setTimeout(() => {
    isIncreased.value = false;
    isDecreased.value = false;
  }, 1000); // Adjust the timeout duration as needed
});
</script>
<style>
ul div.changed-up {
  color: red; /* Adjust this to your desired color for increase */
  transition: color 1s ease;
}

ul div.changed-down {
  color: blue; /* Adjust this to your desired color for decrease */
  transition: color 1s ease;
}
</style>
