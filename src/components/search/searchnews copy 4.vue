<template>
    <div class="spacing-mt1"></div>
    <div class="spacing-search container ">
        <div>
            <div>
                <input v-model="searchQuery" placeholder="search query 3 words" class="naver-input"
                    @keyup.enter="updateSearch">

                <button @click="updateSearch" class="naver-button">S</button>
            </div>
        </div>

    </div>
    <div class="spacing-mt1 container">
    </div>
    <div class="container-xl ">
        <div v-if="isSearching">
            <!-- Loading indicator with elapsed time -->
            <div class="loading-indicator">
                Realated News AI searching Rank {{ elapsedTime }}
            </div>
        </div>
        <div v-if="responseData1 || (exam && exam.length > 0)">
            <div class=" custom-card card" v-for="(post) in responseData1 ? responseData1.API.newsjson : exam">
                <!-- {{ responseData1.API.newsjson }} -->
                <div class="row">
                    <div class="col-5">
                        <a :href="post.link" target="_blank">
                            <img :src="post.img" alt="News Image" class="custom-card-text  card-img-top">
                        </a>
                    </div>
                    <div :class="{ 'col-12': dynamicSize === 12, 'col-7': dynamicSize === 7 }">
                        <div class="row custom-card-text">
                            <h5 class="col-12">
                                <a :href="post.link" target="_blank" style="color: black; text-decoration: none;">
                                    {{ post.title }}
                                </a>
                            </h5>
                            <p class="col-12  "> {{ post.summary.slice(0, 1000) }} ... </p>
                            <p class="col-12  "> {{ post.keywords }} ... </p>
                            <p class="col-12  "> {{ post.gentime }} ... </p>
                            <p class="col-12  "> {{ post.stockerticker[0] }} ... </p>
                        </div>
                    </div>
                    <div class="spacing-mt"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RequestData } from '../../utils/put.js';
import exam from "./example.json"
const { responseData1, parsingdata1, updateItem } = RequestData();
const searchQuery = ref('');
const pdemandedUpdate = ref({
    id: 1,
    name: 'chartcoin',
    payload: { "search": "네이버 스트리밍 트위치", "pages": 1 },
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


const dynamicSize = ref(getDynamicSize());

// Function to update dynamicSize based on window width
function getDynamicSize() {
  return window.innerWidth <= 568 ? 12 : 7;
}

// Update dynamicSize on window resize
const updateDynamicSize = () => {
  dynamicSize.value = getDynamicSize();
};

// Attach event listener when the component is mounted
onMounted(() => {
  window.addEventListener('resize', updateDynamicSize);
});

// Remove event listener when the component is unmounted to prevent memory leaks
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDynamicSize);
});

</script>

<style scoped>
@media (max-width: 568px) {
    .custom-card .col-2 {
        width: 100%;
    }

    .custom-card .col-10 {
        width: 100%;
    }
    .custom-card .col-5 {
        width: 100%;
    }
}

@media (min-width: 800px) {
    .custom-card .col-2 img {
        width: 100%;
    }
}

/* 네이버 스타일 적용 */
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

.naver-button {

    padding: 10px 15px;
    font-size: 16px;
    background-color: #ffffff;
    color: #000000;
    border: none;
    border-radius: 12px;
    cursor: pointer;
}

.spacing-mt1 {
    height: 3vh;

}

.custom-card-text {
    margin-top: 0.01rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
    padding: 1rem;
    transition: transform var(--d) var(--e);
    z-index: 1;
    font-size: 12px;



}

.loading-indicator {
    height: 5.2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    /* Adjust the color as needed */
    background-color: #f0f0f0;
    /* Adjust the background color as needed */
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
    /* Adjust the margin as needed */
}</style>