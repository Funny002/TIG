<template>
  <div class="var-App__side">
    <div class="var-App__side-item" v-for="item of GameMenu">
      <div class="var-App__side-item--avatar">
        <img :src="item.logo" :alt="item.name"/>
      </div>
      <div class="var-App__side-item--body">
        <div class="var-App__side-item--user">
          <div class="var-App__side-item--name">{{ item.name }}</div>
          <div class="var-App__side-item--version">v{{ item.version }}</div>
        </div>
        <div class="var-App__side-item--author" :title="item.author">作者: {{ handlerAuthor(item.author) }}</div>
      </div>
      <div class="var-App__side-item--run">
        <div class="var-App__side-item--run_item" style="background-color: #f66;" @click.stop="onRun(item)">
          <div class="var-App__side-item--run_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
            </svg>
          </div>
          <div class="var-App__side-item--run_text">启动游戏</div>
        </div>
        <div class="var-App__side-item--run_item" v-show="item.isDocs" style="background-color: #999;" @click.stop="onDocs(item)">
          <div class="var-App__side-item--run_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 16 16">
              <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
          </div>
          <div class="var-App__side-item--run_text">查看文档</div>
        </div>
      </div>
    </div>
  </div>
  <div class="var-App__content" style="background-color: #fff;">
    <div class="var-App__body">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">export default { name: 'Layout' };</script>

<script lang="ts" setup>
import { GameMenu } from '@games/index.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

// 处理作者名称
function handlerAuthor(author: string = '') {
  const matchArr = author.match(/(.*)<(.*)>/);
  return matchArr ? matchArr[1] : author;
}

// 运行游戏
function onRun({ name }: { name: string }) {
  router.push({ path: `/games/${ name }` });
}

// 查看文档
function onDocs({ name }: { name: string }) {
  router.push({ path: `/docs/${ name }`, query: { path: '/home' } });
}
</script>
