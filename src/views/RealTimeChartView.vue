<template>
	<body class="container body-full">
		  <TsWebsocket_telegram :message="rankcoins1" /> <br>
		
	</body>
</template>

<script setup>

import rankcoins1 from "@/assets/coinInfo/tickers_rating_order.json";
import TsWebsocket_telegram from "../components/TsWebsocket_telegram.vue"






</script>