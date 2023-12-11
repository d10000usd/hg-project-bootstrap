<template>
<!-- <Telebutton :message="tokenCategory" :takenconinticker="coinExplanation" :dictionarys="props.dictionarys" :componentname='componentname' /> -->
<!-- <Telebutton :message="message" :takenconinticker="tokenValues" :dictionarys="RecomandCoin" :componentname1="talble" /> -->
    <div class="row">
      <div class="col-12">
        <div class="row card-body">
          <h2 class="col-12 card-title color ">Description</h2>
          <!-- <h6 class="col-12 card-text">{{ props.message }}</h6> -->
          <h5 class="col-12 card-text">{{ tokenCategory }}</h5>
          <h6 class="col-12 card-text">{{ coinExplanation }}</h6>
          <ul class="selected-coinli col-12 card-text"> {{ tokenValues }}</ul>
          <hr>
          <!-- <pre class = "selected-coinli ">{{ JSON.stringify(props.dictionarys , null, 2) }}</pre> -->
          <!-- <pre class = "selected-coinli ">{{ JSON.stringify(props.dictionarys.Amount , null, 2) }}</pre> -->
          <!-- <pre class = "selected-coinli ">{{ JSON.stringify(props.dictionarys.Suggestcoin.balance , null, 2) }}</pre> -->
        
          <!-- <chart :message="chartMessage" /> -->
        </div>
      </div>


    </div>
</template>

<script setup>

import { computed  } from 'vue'
import { defineProps } from 'vue';
import coin_explain from "@/assets/coinInfo/coin_explain.json"
import DynamicCategorizing from "@/assets/coinInfo/DynamicCategorizing.json"
import Telebutton from "./TelegramMsg.vue"
const componentname = "categories"
const props = defineProps(['message', 'takenconinticker', 'dictionarys']);

const coinExplanation = computed(() => coin_explain[props.message] || "Have to choice in list. Explains not available");

// const giturl = ref({
//   apisend: urlnum
// });

const getKeyForToken = (token) => {
  for (const category in DynamicCategorizing) {
    if (DynamicCategorizing[category].includes(token)) {
      return category;
    }
  }
  return 'Watching';
};

const getValuesForKey = (key) => DynamicCategorizing[key] || [];

const tokenCategory = computed(() => getKeyForToken(props.message));
// const tokenValues = computed(() => getValuesForKey(tokenCategory.value));
const tokenValues = computed(() => getValuesForKey(tokenCategory.value).map(value => value.replace("KRW-", "")));

// const chartMessage = computed(() => ({
//   types: 'candle',
//   ticker: tokenCategory.value,
//   candlecnt: 123,
//   timeInterval: 'days'
// }));





</script>

<style scoped>
.color{
  color: brown;
}
</style>
