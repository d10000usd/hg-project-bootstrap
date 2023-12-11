
<template>


  <body class=" c-custom-card">
    <h1>Indicator Analysis</h1>
    <InfoScreen_categories :message="selectedValue" :takenconinticker=kes :dictionarys=RecomandCoin />
    <div class="">
      <!-- {{ tokenValues }} -->
      
    </div>
    <div>
      <!-- Buttons to toggle sorting orders -->

      <!-- Display data in a grid -->
      <div class="grid-row" v-for="(value, key) in data" :key="key"  @click="displayValue(key)"
      :class="{ 'selected-red-row': isValueInTokenValues(value?.code?.split('-')[1]) }">
        <div class="smaller-cell-price" @click="handleButtonClick(key)">{{ value?.code.split("-")[1] }}</div>
        <div class="smaller-cell-price" :class="{ 'custom-button-red': value?.signed_change_rate > 0, 'custom-button-blue': value?.signed_change_rate < 0 }">{{ ((value?.signed_change_rate || 0) * 100).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ (value?.L52 || 0).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ (value?.H52 || 0).toFixed(2) }}</div>
        <div class="btc-cell-price">{{ ((value?.trade_price || 0) ).toFixed(2) }}</div>
        <div class="smaller-cell-price">{{ formatNumberWithSuffix(((value?.acc_trade_price_24h || 0) ).toFixed(2)) }}</div>
       
        <router-link class="smaller-cell-price" :to="{ name: 'TsWebsocket_Report', query: { message: JSON.stringify(selectedValue) } }">
          <div class="smaller-cell-price" @click="handleButtonClick(key)">{{ value?.code.split("-")[1] }} </div>
        </router-link>
      </div>
    </div>
  </body>

</template>

<script setup>
import Telebutton from "./TelegramMsg.vue"
// import { ref, onMounted, watch } from 'vue';
import rankcoins1 from "@/assets/coinInfo/tickers_rating_order.json";
import { useWebSocketLogic } from '../stores/WebsocketConnector';
import InfoScreen_categories from "./InfoScreen_categories.vue"
import { ref, onMounted,computed } from 'vue';

import {formatNumberWithSuffix} from "../ts/formatNumberWithSuffix"
import DynamicCategorizing from "@/assets/coinInfo/DynamicCategorizing.json"
const sortingOrder = ref('signed_change_rate');
const typesort = ref('asc');
const selectedKey = ref(null);
let { sortedWsData: data ,keysOnlyData :kes } = useWebSocketLogic(rankcoins1, "TsWebsocket_all", sortingOrder.value, typesort.value,2,0);
const getKeyForToken = (token) => {
  for (const category in DynamicCategorizing) {
    if (DynamicCategorizing[category].includes(token)) {
      return category;
    }
  }
  return 'Smart Contract Platforms';
};
const getValuesForKey = (key) => DynamicCategorizing[key] || [];
const tokenCategory = computed(() => getKeyForToken(selectedValue.value ));
// const tokenValues = computed(() => getValuesForKey(tokenCategory.value));
const tokenValues = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("KRW-", "")));
const isValueInTokenValues = (value) => tokenValues.value.includes(value);
onMounted(() => {

});

const selectedValue = ref({
  "Suggest coin": 
  kes
  
});
const RecomandCoin = ref({
  "RecomandCoin coin": 
  kes
  
});
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
}

</style>