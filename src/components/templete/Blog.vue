<template>
  <body class="container ">
    <div class="spacing-mt"></div>

    <div v-if="NavJsondata" v-for="(post, filename) in gpt">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <!-- <h5 class="col-11 card-title">Title</h5> -->
            <BlogPost :key="filename" :title="post.title" :contentUrl="post.contentUrl" />
          </div>
        </div>


      </div>
    </div>



  </body>
</template>

<script setup>
import { GitJsonRead } from "../../ts/GitJsonRead"
import { ref, onMounted, computed } from "vue"
import BlogPost from './BlogPost.vue';
import { generateImageUrl } from "../../ts/GetImageUrl"


const NavJsondata = ref(null);
const gpt = ref(null);
const updateJsonData = async () => {
  // git 에 저장된 주소 읽고 딕셔너리에서 
  NavJsondata.value = await GitJsonRead();

  const originalGpt = NavJsondata.value.Blob.md.Gpt;
  const reversedGpt = Object.fromEntries(Object.entries(originalGpt).reverse());
  gpt.value = reversedGpt;
}


onMounted(async () => {

  updateJsonData(); // Call the custom function initially
});

</script>
<style>
.spacing-mt {
  margin: 50px;
}
</style>