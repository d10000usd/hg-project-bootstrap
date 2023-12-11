

<template>
  
        <button  class = "telebtn" @click="sendMessageAndUpdateStatus(load)">telegram alram :: {{ st }}</button><br>
        <!-- <button  class = "telebtn" @click="callbackCheckOfCondition(load)">callback :: {{ st }}</button><br> -->
</template>

<script setup>
import {ref} from "vue"
import {
  botToken,
  chatId,

  messageStatus,
  sendMessageAndUpdateStatus,
  callbackCheckOfCondition

} from '../stores/TelegramMessageSender.ts';
const st = ref(messageStatus)

const props = defineProps(['message', 'takenconinticker', 'dictionarys','componentname']);

const imagePath1 = 'https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/Team/33-connection.svg';
let load = {

  // 'takenconinticker':props.takenconinticker ,
  'assets':props.dictionarys ,
  'execution' : props.componentname
};
</script>
<style scoped>
.telebtn {
    cursor: pointer;
    /* margin-top: 1.5rem; */
    font-size: 0.65rem;
    font-weight: bold;
    letter-spacing: 0.025rem;
    text-transform: uppercase;
    color: rgb(255, 255, 255);
    background-color: rgb(41, 106, 144);
    border: none;
    /* border-radius: 20px; */
    width: 12rem;
    height: 2rem;
    text-align: center; /* Center the text horizontally */
    line-height: 20px; /* Center the text vertically by setting line-height equal to the height */
}
</style>