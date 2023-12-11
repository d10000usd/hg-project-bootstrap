<script setup >
import { RouterLink, RouterView } from 'vue-router'
import HeaderLinkBar from "./layout/TopHeader.vue"

import UtterancesReplyView from "./views/UtterancesReplyView.vue"

</script>

<template>
<HeaderLinkBar/>
<div class=" mt-5"></div>

<RouterView/>

<!-- <UtterancesReplyView/> -->

</template>

<style scoped>
  img {
  max-width: 50%;
  height: auto;
  display: block;
  margin: auto;
}
</style>
