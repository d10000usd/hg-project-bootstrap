<template>
    <div class="spacing-mt1"></div>
    <div class="spacing-search container ">
        <div>
            <input v-model="searchQuery" placeholder="search query 3 words" class="naver-input">
            <!-- <button @click="updateSearch" class="naver-button"> S</button> -->
            <button @click="updateSearch" class="naver-button" :style="{ backgroundColor: buttonBackgroundColor }"> S</button>
        </div>
    </div>

    <div class="spacing-mt1 container"></div>
    <div class="container-xl ">

        <div v-if="responseData1 || (exam && exam.length > 0)">
            <div class=" custom-card card" v-for="(post, index) in responseData1 ? responseData1.API.newsjson : exam"
            :style="{ backgroundColor: (responseData1 ) ? (index % 2 === 0 ? 'white' : '') : 'white' }"
            >
                <div class="row">
                    <div class="col-2">
                        <a :href="post.link" target="_blank">
                            <img :src="post.img" alt="News Image" class="custom-card-text  card-img-top">
                        </a>
                    </div>
                    <div class="col-9">
                        <div class="row custom-card-text">
                            <h5 class="col-12">
                                <a :href="post.link" target="_blank" style="color: black; text-decoration: none;">
                                    {{ post.title }}
                                </a>
                            </h5>
                            <p class="col-12  "> {{ post.summary.slice(0, 200) }} ... </p>
                            <p class="col-12  "> {{ post.keywords }} ... </p>
                            <p class="col-12  "> {{ post.gentime }} ... </p>
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
const buttonBackgroundColor = ref('white'); // Initial background color

const updateSearch = () => {
    // Update pdemandedUpdate with the search query
    pdemandedUpdate.value.payload.search = searchQuery.value;

    // Trigger the updateItem function
    updateItem(pdemandedUpdate.value);

    buttonBackgroundColor.value = 'gray';
    if (responseData1.value) {
    setTimeout(() => {
      buttonBackgroundColor.value = 'white';
    }, 1000); // Adjust the delay time (in milliseconds) as needed
  }
};

</script>

<style scoped>
@media (max-width: 568px) {
    .custom-card .col-3 .col-2 {
        width: 100%;
    }

    .custom-card .col-9 {
        width: 100%;
    }
}

@media (min-width: 800px) {
    .custom-card .col-3 img {
        width: 100%;
    }
}

/* 네이버 스타일 적용 */
.spacing-search {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(204, 204, 204);
    height: 5.2vh;
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
    height: 3vh;
    outline: none;
}

.naver-button {

    padding: 10px 15px;
    font-size: 15px;
    background-color: #ffffff;
    color: #000000;
    border: none;
    border-radius: 12px;
    cursor: pointer;
}

.spacing-mt1 {
    height: 2vh;

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
</style>