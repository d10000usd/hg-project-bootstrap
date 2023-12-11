<template>
    <div class="spacing-mt1"></div>
    <div class="spacing-search container ">
        <div>
            <button @click="updateSearch" class="trp-naver-button">S</button>
            <input v-model="searchQuery" placeholder="검색어 3단어 이상" class="naver-input">
            <button @click="updateSearch" class="naver-button">S</button>
            <button @click="updateSearch" class="naver-button">S</button>
        </div>
    </div>

    <div class="spacing-mt1"></div>
    <div class="container ">

        <!-- <div v-if="responseData1" v-for="(post) in responseData1.API.newsjson"> -->
        <div class=" custom-card " v-if="exam" v-for="(post) in exam">
            <div class="row">
                <div class="col-2 ">
                    <a :href="post.link" target="_blank">
                        <img :src="post.img" alt="News Image" class="card-img-top">
                    </a>
                </div>
                <div class="col-10">
                    <div class="row ">
                        <h5 class="col-12 card-title"> {{ post.title }}</h5>
                        <p class="col-12 custom-card-text"> {{ post.summary.slice(0, 200) }} ... </p>
                    </div>
                </div>
                <div class="spacing-mt"></div>
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
    name: 'search rank',
    payload: { "search": "네이버 스트리밍 트위치", "pages": 3 },
});

const updateSearch = () => {
    // Update pdemandedUpdate with the search query
    pdemandedUpdate.value.payload.search = searchQuery.value;

    // Trigger the updateItem function
    updateItem(pdemandedUpdate.value);
};

</script>

<style scoped>
.custom-card {
    @media (max-width: 468px) {
        .col-2 {
            width: 100%;
            /* Set the width to 100% on smaller screens */
        }

        .col-10 {
            width: 100%;
            /* Set the width to 100% on smaller screens */
        }
    }


}

/* 네이버 스타일 적용 */
.spacing-search {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(204, 204, 204);
    height: 6vh;
    /* 주석 해제하여 높이 지정 */
    width: 700px;
    outline: none;
    /* 입력 시 기본 테두리 제거 */
    border-radius: 40px;
}

.naver-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid transparent !important;
    /* !important로 강제 적용 */
    border-radius: 4px;
    margin-right: 8px;
    width: 500px;
    outline: none;
}

.naver-button {

    padding: 10px 15px;
    font-size: 16px;
    background-color: #42b9f4;
    color: #fff;
    border: none;
    border-radius: 400px;
    cursor: pointer;
    margin-left: 0.5rem;

}

.trp-naver-button {

    padding: 10px 15px;
    font-size: 20px;
    background-color: #ffffff;

    border: none;
    border-radius: 400px;
    cursor: pointer;
    margin-left: 0.5rem;
    color: black;
}

.spacing-mt1 {
    height: 3vh;

}

.img-top {
    border-radius: 6px;
    /* 모서리를 둥글게 만들기 위해 border-radius 추가 */

}
.custom-card-text {
    margin-top: 0.6rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1rem;
    transition: transform var(--d) var(--e);
    z-index: 1;
  }
</style>