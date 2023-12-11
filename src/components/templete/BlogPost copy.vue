<template>

    <div >
      <p @click="toggleContent">
       {{ restOfText  }}
      </p>
      <p >{{ number }}</p>
    </div>
    <div v-if="showContent">
      <Markdown
        :source="content"
        :html="true"
        :breaks="true"
        :linkify="true"
        :typographer="true"
      />
    </div>
</template>

<style>

</style>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import Markdown from 'vue3-markdown-it';

const props = defineProps(['title', 'contentUrl']);
const content = ref('');
const showContent = ref(false);
const [fulltilte, label, number, restOfText] = props.title.match(/([^\d]+)(\d+)(.*)/);
onMounted(async () => {
  const response = await fetch(props.contentUrl);
  content.value = await response.text();
});

const toggleContent = () => {
  showContent.value = !showContent.value;
};
</script>

