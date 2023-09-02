<template>
  <div class="var-Docs">
    <var-error v-if="data.isError"/>
    <div class="var-Docs__body" v-else>
      <var-breadcrumb :data="[{name: '首页', router: '/home'}, data.name, {name: '文档', router: `/docs/${data.name}`}, data.path]">
        <template #separator>
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"></path>
          </svg>
        </template>
      </var-breadcrumb>
      <div class="var-Docs__Content markdown-body" v-html="data.content"/>
    </div>
  </div>
</template>

<script lang="ts"> export default { name: 'Docs' };</script>
<script setup lang="ts">
import VarError from '@modules/Error/index.vue';
import VarBreadcrumb from '@modules/Breadcrumb/index.vue';
//
import { onMounted, reactive, watch } from 'vue';
import { gameModules } from '@games/index.ts';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
//
import 'github-markdown-css/github-markdown.css';

const route = useRoute();
const gameKeys = gameModules.map(({ name }) => name);
const data = reactive({ name: '', path: '', content: '', isError: false });

onMounted(initPageFile);
watch(route, initPageFile);

function handlePath(item: any) {
  console.log(JSON.stringify(route));
  return `${ item.mkdir }/${ item.file.description }`;
}

async function initPageFile() {
  data.name = (route.params.name || '') as string;
  data.isError = !gameKeys.includes(data.name);
  if (data.isError) return;
  const item = gameModules.find(({ name }) => name === data.name);
  if (!item) return data.isError = true;
  if (data.isError) return;
  try {
    const path = `../../games/${ handlePath(item) }.md?raw`;
    data.path = (path.match(/\/(\w+)\.md/) || [])[1] || '';
    const content = await import(/* @vite-ignore */ path);
    data.content = marked.parse(content.default || content, { breaks: true, gfm: true });
    document.title = `${ item.name } - 文档|${ window.__CONFIG__.title }`;
  } catch (e) {
    data.isError = true;
  }
}
</script>

<style lang="scss" scoped src="./style.scss"/>
