<template>
    <Markdown :source="mkcontens.fileContent" :html="true" :breaks="true" :linkify="true" :typographer="true" />
</template>
<script setup>

import {  computed } from 'vue'
import Markdown from 'vue3-markdown-it';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

const props = defineProps({
    message:String
});

const mkcontens = computed(() => ({
'fileContent': props.message,
}));

</script>