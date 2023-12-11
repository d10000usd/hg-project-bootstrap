<template>
  
 <div class="c-custom-card">

  <h1>White List</h1>
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
    <TsWebsocket_table :message="watches1"/>
</template>

<style scoped>

</style>

<script setup>
import { ref } from 'vue';
import TsWebsocket_table from "./TsWebsocket_table.vue"
import watches1 from "@/assets/coinInfo/tickers_watch.json";
import { useWebSocketLogic } from '../stores/WebsocketConnector';
// const wsdata = ref([])
const { sortedWsData: data } = useWebSocketLogic(watches1,"TsWebsocket_watch", 'signed_change_rate',"asc");
import { getCount } from '../ts/risefall'; //
const selectedValue = ref({
  "Major Cryptocurrencies": [

    "KRW-BTG",
    "KRW-BSV"
  ]
});

function handleButtonClick(index) {
  selectedValue.value = index;
}
// console.log('sortedWsData1:', sortedWsData1);
// console.log('sortedWsData2:', sortedWsData2);
// console.log('sortedWsData3:', sortedWsData3);

</script>