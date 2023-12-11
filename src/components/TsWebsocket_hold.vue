<template>
  <div class="c-custom-card">
    <!-- Use router-link to navigate and pass the selectedValue as a query parameter -->

    <h1>Positioning</h1>
    <div v-if="selectedValue !== null">
      Selected Value: 
    </div>
    <!-- Use v-for to loop through each item in data -->
   
    <router-link :to="{ name: 'TsWebsocket_Report', query: { message: JSON.stringify(selectedValue) } }">
      <div class="custom-button" v-for="(item, index) in data" :key="index" :class="{ 'custom-button-red': item.signed_change_rate > 0, 'custom-button-blue': item.signed_change_rate < 0 }" @click="handleButtonClick(index)">
        {{index.split("-")[1]}} {{ ((item?.signed_change_rate || 0) * 100).toFixed(2) }}
      </div>
    </router-link>
    </div>
    <div class = "c-custom-card" >
      positive : {{ getCount(data, 'positive') }}<br>

      negative : {{ getCount(data, 'negative') }}
    </div>
    <TsWebsocket_table :message="rankcoins1"/>
</template>

<script setup>
import { ref } from 'vue';
import rankcoins1 from "@/assets/coinInfo/balance_ticker.json";
import { useWebSocketLogic } from '../stores/WebsocketConnector';
import { getCount } from '../ts/risefall'; //
import TsWebsocket_table from "./TsWebsocket_table.vue"
const { sortedWsData: data } = useWebSocketLogic(rankcoins1,"TsWebsocket_hold",'signed_change_rate',"asc");
const selectedValue = ref({
  "Major Cryptocurrencies": [

    "KRW-BTG",
    "KRW-BSV"
  ]
});

function handleButtonClick(index) {
  selectedValue.value = index;
}
</script>
