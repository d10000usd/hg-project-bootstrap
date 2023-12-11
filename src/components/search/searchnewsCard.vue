<template>
    <div class="list-group column-item">

        <a :href="news.link" class="list-group-item list-group-item-action " aria-current="true">
            <img :src="news.img" class="card-img-top" alt="Image" style="width: 350px; height: auto;" />
        
            <div class="d-flex w-100 justify-content-between">
                <p class="mb-1 font-sh ">{{ news.title }}</p>
               
                
            </div>
            <p class="font-timesmall mb-1">{{news.gentime.slice(2,17)}}.</p>
            <!-- <p class="mb-1">{{ news.keywords }}</p> -->
        

        </a>
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <p class="mb-1">#weight</p>
                <small class="text-body-secondary"></small>
            </div>
           
            <small class="text-body-secondary">{{ news.searchkeycount }}</small>
        </div>
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <p class="mb-1">#keywords</p>
                <small class="text-body-secondary"></small>
            </div>
           
            <small class="text-body-secondary">{{ news.keywords }}</small>
        </div>
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <p class="mb-1">#coincounts</p>
                <small class="text-body-secondary"></small>
            </div>
           
            <small class="text-body-secondary">{{ news.coincounts }}</small>
        </div>
        <a  href="#" class="list-group-item list-group-item-action">

            <div v-if="news.stockerticker ">
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1">#company</p>
                    <small class="text-body-secondary"></small>
                </div> <small class="text-body-secondary">{{ news.stockerticker[0] }}</small>
            </div>

        </a>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue';
import { generateImageUrl } from "../../ts/GetImageUrl"
const props = defineProps({
    message: Object,
});

const news = ref(props.message ? { ...props.message } : {});
</script>
<style scoped>
.column-item {

    width: calc(100% - 0px);
    /* 2열로 나열하려면 50%로 설정, 여백 등은 필요에 따라 조절 */
    margin-bottom: 20px;
    /* 아이템 간의 간격을 조절 */
}

.font-sh {
    font-size: 16px;
}
.font-timesmall {
    font-size: 0.7rem;
}
</style>
    