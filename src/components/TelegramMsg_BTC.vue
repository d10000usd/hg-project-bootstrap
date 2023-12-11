<template>
  <button class="telebtn" @click="sendMessageAndUpdateStatus(load)" :class="{ greenBtn: state === 'ok', redBtn: state === 'error' }">
    tele :: {{ state }}
  </button><br>
</template>
<style scoped>
.telebtn {
    cursor: pointer;
    font-size: 0.65rem;
    font-weight: bold;
    letter-spacing: 0.025rem;
    text-transform: uppercase;
    color: rgb(255, 255, 255);
    background-color: rgb(41, 106, 144);
    border: none;
    width: 12rem;
    height: 2rem;
    text-align: center;
    line-height: 20px;
}
.greenBtn {
  background-color: green !important;
}
.redBtn {
  background-color: red !important;
}
</style>
<script setup>
import {ref,reactive,onMounted} from "vue"
import {
  botToken,
  chatId,

  messageStatus,
  sendMessageAndUpdateStatus,
  

} from '../stores/TelegramMessageSender_BTC.ts';
const state = ref(messageStatus)

const props = defineProps(['message', 'takenconinticker', 'dictionarys','componentname']);

const imagePath1 = 'https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/Team/33-connection.svg';
let load = {

  // 'takenconinticker':props.takenconinticker ,
  'assets':props.dictionarys ,
  'execution' : props.componentname
};
onMounted(() => {
  sendMessageAndUpdateStatus(load);
});
</script>
