<template>
  <!-- <tsws/> <br> -->

  <body class="body-full">
    <div class="row ">
      <TsWebsocket_minutesChanges />
      <div class="col-sm-3 ">
        <div class="spacing mb-2">
          <div class="c-custom-card">

          </div>

          <TsWebsocket_hold />
          <TsWebsocket_watch />




        </div>
      </div>
      <div class="col-sm-6 ">
        <div class="spacing mb-2">


            <LocalMKStaticView/>

   


        </div>
      </div>
      <div class="col-sm-3 ">
        <div class="spacing mb-2">
          <div class="c-custom-card">
            <TsWebsocket_all />
          </div>
      
 

        </div>
      </div>
    </div>
  </body>
</template>
<!-- 


 -->

<script setup>
import TsWebsocket_all from "../components/TsWebsocket_all.vue"

import TsWebsocket_main from "../views/TsWebsocket_main.vue"

import sixZeroView from "./sixZeroView.vue"
import LocalMKStaticView from "../views/LocalMKStaticView.vue"


import TsWebsocket_minutesChanges from "../components/TsWebsocket_minutesChanges.vue"
import TsWebsocket_watch from "../components/TsWebsocket_watch.vue"
import TsWebsocket_hold from "../components/TsWebsocket_hold.vue"
// const { sortedWsData: data } = useWebSocketLogic(rankcoins1,"NaviJsonView");
// import tsws1 from "../components/TsWebsocket_1.vue"
</script>
<style scoped>
.spacing {
  margin-top: 1 1rem;
  margin: 10px;
}
</style>