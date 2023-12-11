<template>
  <div class="c-custom-card">
    <div class="col-sm-12 ">

      </div>
    <!-- Use router-link to navigate and pass the selectedValue as a query parameter -->
    <h1>Upbit </h1>
    <div v-if="selectedValue !== null">
      Selected Value:
    </div>
  </div>
  <div class="c-custom-card">
    positive : {{ getCount(data, 'positive') }}<br>
    negative : {{ getCount(data, 'negative') }}<br>
   <li> Todays top rank 5 {{ listd }} </li>
  </div>
  <TsWebsocket_table :message="rankcoins1" />
</template>
<script setup>
import { ref,watch } from 'vue';
import rankcoins1 from "@/assets/coinInfo/tickers_rating_order.json";
import { useWebSocketLogic } from '../stores/WebsocketConnector';
import { getCount,getTopRateCount_positive } from '../ts/risefall'; // Import the getCount function
import TsWebsocket_table from "./TsWebsocket_table.vue"
const { sortedWsData: data } = useWebSocketLogic(rankcoins1, "TsWebsocket_all",'signed_change_rate',"asc");
const selectedValue = ref({
  "Major Cryptocurrencies": [
    "KRW-BTG",
    "KRW-BSV"
  ]
});

const listd = ref([]);

// Watch for changes in data and update listd accordingly
watch(data, (newData) => {
  listd.value = getTopRateCount_positive(newData, 'positive', 5);
});

</script>
<style scoped></style>