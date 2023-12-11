<template>
  
  <div class="c-custom-card">
    <!-- Use router-link to navigate and pass the selectedValue as a query parameter -->
123123
    테이블<br><br>
    <div v-if="selectedValue !== null">
      Selected Value: 
    </div>

      <div class="custom-button" v-for="(item, index) in data" :key="index" :class="{ 'custom-button-red': item.signed_change_rate > 0, 'custom-button-blue': item.signed_change_rate < 0 }" @click="handleButtonClick(index)">
        {{index.split("-")[1]}} {{ ((item?.signed_change_rate || 0) * 100).toFixed(2) }}
      </div>

    </div>

</template>

<script setup>
import { ref } from 'vue';

import rankcoins1 from "@/assets/coinInfo/tickers_rating_order.json";
import { useWebSocketLogic } from '../stores/WebsocketConnector';

const { sortedWsData: data } = useWebSocketLogic(rankcoins1,"TsWebsocket_all",'signed_change_rate',"asc");
const selectedValue = ref({
  "Major Cryptocurrencies": [

    "KRW-BTG",
    "KRW-BSV"
  ],
  "Watching": [
    "KRW-BTC",
    "KRW-ETH",

  ]
});

function handleButtonClick(index) {
  selectedValue.value = index;
}
</script>
<style scoped>

</style>