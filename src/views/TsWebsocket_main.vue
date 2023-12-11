<template>
  <body class="container body-full">
    <div>
      <h1 class="c-custom-card">{{ getMessage(message) }}</h1>
    </div>
    <input type="range" min="3" max="3.6" step="0.01" v-model="sliderValue" @input="updateSliceNumber" class="form-range" style="width: 100%" />
    <span class="mx-3 badge bg-secondary">{{ sliderValue }}</span>

    <div class="spacing">
      <TsWebsocket_chart :message="dwmCandle0" :pncounts="sliderValue" />
    </div>
    <div class="spacing"></div>
    <div class="spacing">
      <TsWebsocket_chart :message="dwmCandle1" :pncounts="sliderValue"/>
    </div>
    <div class="spacing"></div>
    <div class="spacing">
      <TsWebsocket_chart :message="dwmCandle2" :pncounts="sliderValue" />
    </div>
  </body>
</template>

<script setup>
import { onMounted, ref, defineProps, watch, reactive } from 'vue';
import TsWebsocket_chart from "../components/TsWebsocket_chart.vue";

const { message } = defineProps(['message']);

const sliderValue = ref(3);

const updateSliceNumber = (event) => {
  const newValue = event.target.value;
  // Perform necessary operations with the new value if required
  sliderValue.value = newValue;
};

watch(sliderValue, (newSliderValue) => {
  dwmCandle0.weightValue = newSliderValue;
  dwmCandle1.weightValue = newSliderValue;
  dwmCandle2.weightValue = newSliderValue;
});

const getMessage = (msg) => {
  if (!msg || !msg.length) {
    return "KRW-BTC";
  }
  return msg;
};

const dwmCandle0 = reactive({
  types: 'candle',
  ticker: getMessage(message),
  candlecnt: 100,
  timeInterval: 'days',
  weightValue: 3.41,
});

const dwmCandle1 = reactive({
  types: 'candle',
  ticker: getMessage(message),
  candlecnt: 310,
  timeInterval: 'weeks',
  weightValue: 3.2,
});

const dwmCandle2 = reactive({
  types: 'candle',
  ticker: getMessage(message),
  candlecnt: 310,
  timeInterval: 'minute240',
  weightValue: 3,
});
</script>

<style scoped>
.spacing {
  margin-top: 1 1rem;
  margin: 10px;
}
</style>