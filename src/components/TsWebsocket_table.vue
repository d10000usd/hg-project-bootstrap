<!-- // YourComponent.vue -->
<template>
  <div class="c-custom-card">

    <InfoScreen_categories :message="selectedValue" :takenconinticker=keysOnly :dictionarys=RecomandCoin />

  </div>
  <body class=" c-custom-card">
    <Telebutton :message="message" :takenconinticker="tokenValues" :dictionarys="RecomandCoin" :componentname="componentname" />
    <div>
      <!-- Buttons to toggle sorting orders -->
      <div class="grid-row header">
        <div class="smaller-cell-price grid-cell-header">tele</div>
      
        <button class="smaller-cell-price grid-cell-header" @click="toggleSortOrder('signed_change_rate')">R</button>
        <button class="smaller-cell-price grid-cell-header" @click="toggleSortOrder('L52')">L52</button>
        <button class="smaller-cell-price grid-cell-header" @click="toggleSortOrder('H52')">H52</button>
        <button class="smaller-cell-price grid-cell-header" @click="toggleSortOrder('trade_price')">P</button>
        <button class="smaller-cell-price grid-cell-header" @click="toggleSortOrder('acc_trade_price_24h')">V</button>
        <div class="smaller-cell-price grid-cell-header">chart</div>
      </div>
      <!-- Display data in a grid -->
      <div class="grid-row" v-for="(value, key) in data" :key="key" @click="displayValue(key)"

        :class="{ 'selected-red-row': isValueInTokenValues(value?.code?.split('-')[1]) }">
        
        <div class="smaller-cell-price" @click="handleButtonClick(key)">{{ value?.code.split("-")[1] }}</div>
        <div class="smaller-cell-price"
          :class="{ 'custom-button-red': value?.signed_change_rate > 0, 'custom-button-blue': value?.signed_change_rate < 0 }">
          {{ ((value?.signed_change_rate || 0) * 100).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ (value?.L52 || 0).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ (value?.H52 || 0).toFixed(2) }}</div>
        <div class="btc-cell-price">{{ ((value?.trade_price || 0)).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ formatNumberWithSuffix(((value?.acc_trade_price_24h || 0)).toFixed(2)) }}
        </div>
        <router-link class="smaller-cell-price"
          :to="{ name: 'TsWebsocket_main', query: { message: JSON.stringify(selectedValue) } }">
          <div class="smaller-cell-price" @click="handleButtonClick(key)">{{ value?.code.split("-")[1] }} </div>
        </router-link>

      </div>
    </div>
    positive : {{ getCount(data, 'positive') }}<br>
    negative : {{ getCount(data, 'negative') }}<br>
 
  </body>

</template>
<script setup>

import InfoScreen_categories from "./InfoScreen_categories.vue";
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import { useWebSocketLogic } from '../stores/WebsocketConnector';
import { formatNumberWithSuffix } from "../ts/formatNumberWithSuffix";
import { getCount, getTopRateCount_positive } from '../ts/risefall';
import DynamicCategorizing from "@/assets/coinInfo/DynamicCategorizing.json";
import Telebutton from "./TelegramMsg.vue";

const componentname = "table";

const props = defineProps({
  message: Object,
  pncounts: Object,
});

const commonValues = ref([]);
const coinlist = ref(Object.assign([], props.message));
const pne = ref(Object.assign([], props.message));
const sortingOrder = ref('signed_change_rate');
const typesort = ref('asc');
const selectedKey = ref(null);
const codeAndRateArray = ref([]);
const filteredDataList = ref();

let { sortedWsData: data, keysOnlyData: keysOnly, rawdata: rawdatas } = useWebSocketLogic(coinlist.value, "InfoScreen_categories", sortingOrder.value, "asc", 130, 0);


const getKeyForToken = (token) => {
  for (const category in DynamicCategorizing) {
    if (DynamicCategorizing[category].includes(token)) {
      return category;
    }
  }
  return 'Smart Contract Platforms';
};

const getValuesForKey = (key) => DynamicCategorizing[key] || [];

const tokenCategory = computed(() => getKeyForToken(selectedValue.value));
const tokenValuesKRW = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("", "")));
const tokenValues = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("KRW-", "")));
const isValueInTokenValuesKRW = (value) => tokenValuesKRW.value.includes(value);
const isValueInTokenValues = (value) => tokenValues.value.includes(value);
const totalSignedChangeRate = computed(() => calculateTotalSignedChangeRate(rawdatas.value));
const calculateTotalSignedChangeRate = (data) => {
  if (!data || data.length === 0) return 0;

  const minbuy = 5000;
  const buyea = 1;
  const total = data.reduce((sum, value) => sum + ((value?.signed_change_rate || 0) * 100), 0);
  const b = data.length;
  const a = minbuy * b * buyea;

  const balance = a;
  const valuationAmount = String((a + a / 100 * (total / b)).toFixed(2));
  const dayOverDayChange = String((a / 100 * (total / b)).toFixed(2));
  const dayOverDayRate = Number((total / b).toFixed(2));
  const upbitAllBuy = String(b);

  return {
    "Balance ": balance,
    "Amount  ": valuationAmount,
    "Change  ": dayOverDayChange,
    "Rate    ": dayOverDayRate,
    "Upbitbuy": upbitAllBuy,
  };
};
const totalSignedChangeRate_selcted = computed(() => {
  const filteredData = rawdatas.value ? rawdatas.value.filter(value => tokenValuesKRW.value.includes(value?.code)) : [];

  filteredDataList.value = filteredData;
  codeAndRateArray.value = filteredData.map(item => ({
    code: item.code,
    rate: Number(((item?.signed_change_rate || 0) * 100).toFixed(2)),
  }));

  return calculateTotalSignedChangeRate(filteredData);
});

const pncnt = computed(() => {
  const filteredData = rawdatas.value ? rawdatas.value.filter(value => tokenValuesKRW.value.includes(value?.code)) : [];

  const countGreaterZero = filteredData.filter(item => item?.signed_change_rate >= 0).length;
  const countLessZero = filteredData.filter(item => item?.signed_change_rate < 0).length;

  return {
    "Rise": countGreaterZero,
    "Fall": countLessZero,
  };
});

const pncntall = computed(() => {
  const filteredData = rawdatas.value ? rawdatas.value.filter(value => coinlist.value.includes(value?.code)) : [];

  const countGreaterZero = filteredData.filter(item => item?.signed_change_rate >= 0).length;
  const countLessZero = filteredData.filter(item => item?.signed_change_rate < 0).length;

  return {
    "Rise": countGreaterZero,
    "Fall": countLessZero,
  };
});


const selectedValue = ref({
  "Suggestcoin": keysOnly,
});

const RecomandCoin = ref({
  "Suggestcoin": {
    "Amount": totalSignedChangeRate_selcted,
    "buy": codeAndRateArray,
    "pncnt": pncnt,
  },
  "UpbitAll": {
    "Amount": totalSignedChangeRate,
    "pncnt": pncntall,
  },
  "Amount": {
    "Amount": totalSignedChangeRate_selcted,
    "pncnt": pncnt,
  },
});



const toggleSortOrder = (order) => {
  if (sortingOrder.value === order) {
    typesort.value = typesort.value === 'desc' ? 'asc' : 'desc';
  } else {
    sortingOrder.value = order;
    typesort.value = 'desc';
  }
  data = useWebSocketLogic(coinlist.value, "InfoScreen_categories", sortingOrder.value, typesort.value, 130, 0).sortedWsData;
};


onMounted(() => {
  updateCommonValues();
});

watch([coinlist, tokenValues], () => {
  updateCommonValues();
});

function updateCommonValues() {
  commonValues.value = coinlist.value.filter(value => isValueInTokenValuesKRW(value));
}

const displayValue = (key) => {
  selectedKey.value = key;
};

function handleButtonClick(index) {
  selectedValue.value = index;
}
</script>


<style scoped>
.text-red {
  color: rgb(254, 254, 254);
}

.selected-red-row {
  background-color: rgb(236, 147, 147);
  /* or any other styling you want for red rows */
}</style>