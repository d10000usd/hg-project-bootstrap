<template>
<LocalMkStatic :message="mk" class = "container"/><br>
</template>

<script setup>
import { ref } from 'vue';
import { staticLoadMarkdown } from '../ts/StaticLoadMarkdown';


import mkdocs_posts_nav from "@/assets/coinInfo/mkdocs_posts_nav.json";
import LocalMkStatic from "../components/templete/LocalMkStatic.vue"
// Call the function






let path = mkdocs_posts_nav.Public.md[0].Gpt[0]
const mk = ref('')


const localpath = path; // Replace with your desired file path
staticLoadMarkdown(localpath)
    .then(text => {
    
        mk.value = text; 
        // Perform the desired operations using the fetched text
    })
    .catch(error => {
        console.error("Error occurred:", error);
        // Perform appropriate error handling in case of an error
    });
</script>