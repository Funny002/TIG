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
      <div class="var-Docs__Content markdown-body" v-html="data.content" @click.stop="onClick"/>
    </div>
  </div>
</template>

<script lang="ts"> export default { name: 'Docs' };</script>
<script setup lang="ts">
import VarError from '@modules/Error/index.vue';
import VarBreadcrumb from '@modules/Breadcrumb/index.vue';
//
import { onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GameModules } from '@games/index.ts';
import { marked } from 'marked';
//
import 'github-markdown-css/github-markdown.css';

const route = useRoute();
const router = useRouter();
const data = reactive({ name: '', path: '', content: '', markdown: {}, isError: false });

onMounted(initPageFile);
watch(route, initPageFile);

async function initPageFile() {
  try {
    data.name = (route.params.name || '') as string;
    const item = GameModules[data.name];
    if (!item) return data.isError = true;
    data.path = (route.query.path as string) || item.config.markdown;
    //
    data.content = marked.parse(item.markdown[data.path], { breaks: true, gfm: true });
    document.title = `${ data.name } - 文档|${ window.__CONFIG__.title }`;
  } catch (e) {
    data.isError = true;
  }
}

function handlerPath(path: string) {
  return path.split('/').filter(item => item !== '.').join('/');
}

function onClick(event: Event) {
  const target = event.target as HTMLElement;
  if (target.tagName === 'A') {
    event.preventDefault();
    const src = handlerPath(target.getAttribute('href') || '');
    router.push({ path: route.path, query: { path: src ? `./${ src }` : '' } });
  }
}
</script>

<style lang="scss" scoped src="./style.scss"/>
