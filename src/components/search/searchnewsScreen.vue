<template>
    <body class="container ">
      <div class="c-custom-card">
        <div>
          <input v-model="searchQuery" placeholder="Enter search query">
          <button @click="updateSearch">Get News Search</button>
          <pre>{{ responseData1.API}}</pre>
        </div>
      </div>
    </body>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RequestData } from '../../utils/put.js';
  const { responseData1, parsingdata1, updateItem } = RequestData();
  const searchQuery = ref('');
  const pdemandedUpdate = ref({
    id: 1,
    name: 'chartcoin',
    payload: { "search": "네이버 스트리밍 트위치", "pages": 1 },
  });
  
  const updateSearch = () => {
    // Update pdemandedUpdate with the search query
    pdemandedUpdate.value.payload.search = searchQuery.value;
  
    // Trigger the updateItem function
    updateItem(pdemandedUpdate.value);
  };
  </script>