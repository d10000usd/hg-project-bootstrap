<template>
  <body class="body-full">
    <div class="spacing mb-11">
      <div class="c-custom-card">
        <TelegramMsg_BTC
          v-if="tele.L52Changes > tele.settingValue"
          :message="props.message"
          :takenconinticker="KRW-BTC"
          :dictionarys="tele.telemsg"
          :componentname="componentname"
        />
        <h2> Realtime {{ tele.telemsg.assets }}</h2>
      </div>
    </div>
    <div>
      <label for="settingValue">Setting Value:</label>
      <input v-model="inputValue" type="number" id="settingValue" />
      <button @click="updateSettingValue">Update Setting Value</button>
    </div>
    <div>
      <label for="monitoringCoin">Monitoring Coin:</label>
      <input v-model="inputValue1" type="text" id="monitoringCoin" />
      <button @click="updateMonitoringCoin">Update Monitoring Coin</button>
    </div>
    <div>
      <label for="sortingOrder">Sorting Order:</label>
      <input v-model="inputValue2" type="text" id="sortingOrder" />
      <button @click="updateSortingOrder">Update Sorting Order</button>
    </div>
    
    <pre class="pre2">{{ tele.telemsg }}</pre>
  </body>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { TelegramAlarmLogic } from '../stores/TelegramAlarmLogic';
import TelegramMsg_BTC from "./TelegramMsg_BTC.vue";

const componentname = "TsWebsocket_telegram";
const props = defineProps({
  message: Object,
  pncounts: Object,
});

const maxUn = 5;
const minUn = -2;

const paraDict = ref({
  monitoringCoin: 'KRW-BLUR',
  sortingOrder: 'L52',
  settingValue: 300,
  shouldExecute: true,
  messageCounter: 0,
  componentname: 'TsWebsocket_telegram',
  status: 'Rise Monitoring',
  asc_desc: 'asc',
  coinea: 130,
  eta: 0,
  addRatio: 0.5,
  alarmSenddingEa: 2,
  maxrange: 2,
  minrange: 1,
});

const tele = new TelegramAlarmLogic(props, paraDict.value);
tele.run();

const inputValue = ref(300);
const inputValue1 = ref('KRW-BTC');
const inputValue2 = ref('L52');

const updateSettingValue = () => {
  if (!isNaN(inputValue.value)) {
    tele.settingValue.value = parseInt(inputValue.value);
    // Update other values similarly
  } else {
    // Handle invalid input (non-numeric)
    console.error("Invalid input. Please enter a numeric value.");
  }
};

const updateMonitoringCoin = () => {
  if ((inputValue1.value)) {
    tele.monitoringCoin = (inputValue1.value);
    
    // Update other values similarly
  } else {
    // Handle invalid input (non-numeric)
    console.error("Invalid input. Please enter a numeric value.");
  }
};

const updateSortingOrder = () => {
  if ((inputValue2.value)) {
    tele.sortingOrderkey.value = (inputValue2.value);
    // Update other values similarly
  } else {
    // Handle invalid input (non-numeric)
    console.error("Invalid input. Please enter a numeric value.");
  }
};
</script>

<style scoped>
  .pre2 {
    background-color: rgb(124, 175, 226);
  }
  .pre1 {
    background-color: rgb(249, 249, 232);
  }
</style>