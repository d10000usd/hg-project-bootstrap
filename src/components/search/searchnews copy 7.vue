<template>
    <div class=container>
        <div class="spacing-mt1"></div>
        <div class="spacing-search  container">
            <div>
                <div>
                    <input v-model="searchQuery" placeholder="search query 3 words" class="naver-input"
                        @keyup.enter="updateSearch">
                    <button @click="updateSearch" class="naver-button">S</button>
                </div>
            </div>

        </div>
        <div class="spacing-mt1 ">
        </div>
        <div v-if="isSearching">

            <div class="loading-indicator">
                Realated News AI searching Rank {{ elapsedTime }}
            </div>
        </div>
        <div class="container" style="display: flex; overflow-x: auto;">
            <div v-if="responseData1" style="display: flex; ">
                <div class=""
                    v-for="(post, index) in responseData1 ? responseData1.API.newsjson.newscontents : exam.newscontents">
                    <!-- <searchnewsCard :message="post" v-if="index === 1" /> -->
                    <searchnewsCard :message="post" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RequestData } from '../../utils/put.js';
import exam from "./example1.json"
import searchnewsCard from "./searchnewsCard.vue"
const { responseData1, parsingdata1, updateItem } = RequestData();
const searchQuery = ref('');
const pdemandedUpdate = ref({
    id: 1,
    name: 'chartcoin',
    payload: { "search": "네이버 스트리밍 트위치", "pages": 3 },
});
const isSearching = ref(false);
const elapsedTime = ref(0);

const updateSearch = () => {
    // Set isSearching to true when the search begins
    isSearching.value = true;

    // Start a timer to update elapsed time every second
    const timerId = setInterval(() => {
        elapsedTime.value += 1;
    }, 1000);

    // Update pdemandedUpdate with the search query
    pdemandedUpdate.value.payload.search = searchQuery.value;

    // Trigger the updateItem function
    updateItem(pdemandedUpdate.value)
        .then(() => {
            // Set isSearching to false when the search is complete
            isSearching.value = false;

            // Clear the timer
            clearInterval(timerId);

            // Reset elapsed time
            elapsedTime.value = 0;
        });
};



</script>

<style>
.spacing-mt1 {
    height: 7vh;

}

.spacing-search {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(204, 204, 204);
    height: 6.2vh;
    /* 주석 해제하여 높이 지정 */
    width: 404px;
    outline: none;
    /* 입력 시 기본 테두리 제거 */
    border-radius: 8px;
}

.naver-input {

    padding: 10px;
    font-size: 16px;
    border: 1px solid transparent !important;
    /* !important로 강제 적용 */
    border-radius: 4px;
    margin-right: 8px;
    width: 330px;
    height: 3.7vh;
    outline: none;
}


.item {
    flex-basis: calc(25% - 10px);
    /* Adjust the percentage as needed and consider margins */
    margin-bottom: 10px;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .item {
        flex-basis: calc(33.33% - 10px);
        /* Adjust for smaller screens */
    }
}

@media (max-width: 480px) {
    .item {
        flex-basis: calc(50% - 10px);
        /* Adjust for even smaller screens */
    }
}
.row-mbt {


/* 2열로 나열하려면 50%로 설정, 여백 등은 필요에 따라 조절 */
margin-bottom: 20px;
/* 아이템 간의 간격을 조절 */
}
</style>