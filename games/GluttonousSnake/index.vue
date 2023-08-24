<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="1" autofocus="autofocus" @blur.stop="onSwitchState(true)">
    <div class="var-GluttonousSnake__content" :style="{width: canvasStyle.width + 20 + 'px'}">
      <div class="var-GluttonousSnake__header">
        <div class="var-GluttonousSnake__header--item">食物：{{ game.score }}</div>
        <div class="var-GluttonousSnake__header--item">时间：{{ game.runTime }}</div>
      </div>
      <canvas ref="canvas" :width="canvasStyle.width" :height="canvasStyle.height" :style="{width: canvasStyle.width + 'px', height: canvasStyle.height + 'px'}"/>
    </div>
    <div class="var-tips" v-show="game.isStop" style="pointer-events: none;">
      <div class="var-tips__header">提示</div>
      <div class="var-tips__content">按下<span class="is-btn">空格键</span>可<span class="is-btn">开始/暂停</span>游戏</div>
    </div>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { GameBackgroundBlock } from '@games/utils/Graphics.ts';
import { computed, onMounted, reactive, ref } from 'vue';
import { Keyboard } from '@utils/keyboard.ts';
import { Snake } from './utils/Graphics.ts';
import { Create, debounce } from 'tig-core';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const data = reactive<{
  blockSize: number;
  core: Create | null;
  snake: Snake | null;
  keyBinding: Keyboard | null;
  border: { width: number; height: number; }
}>({ core: null, snake: null, blockSize: 10, keyBinding: null, border: { width: 62, height: 32 } });

const game = reactive<{
  walls: any[];
  score: number;
  timer: number;
  isStop: boolean;
  runTime: string;
}>({ score: 0, walls: [], timer: 190, runTime: '0', isStop: true });

// 实际盒子大小
const canvasStyle = computed(() => {
  const { border: { width, height }, blockSize } = data;
  const getSize = (value: number) => (blockSize + 1) * value - 1;
  return { width: getSize(width), height: getSize(height) };
});

onMounted(() => {
  if (root.value) {
    root.value.focus();
    initKeyBinding(root.value);
  }
  if (canvas.value) initCreate(canvas.value);
});

function initKeyBinding(dom: HTMLDivElement) {
  data.keyBinding = new Keyboard(dom);
  let timeout: NodeJS.Timeout | null = null;

  function setDirection(dir: 0 | 1 | 2 | 3) {
    return function () {
      if (!data.snake) return;
      const snake = data.snake;
      const newTimer = 80;
      // 长按加速
      if (snake.direction === dir) {
        snake.timer = newTimer;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          snake.timer = game.timer;
          timeout = null;
        }, newTimer);
      }
      // 方向变更
      snake.direction = dir;
    };
  }

  data.keyBinding.on('ArrowUp', setDirection(0));
  data.keyBinding.on('ArrowDown', setDirection(1));
  data.keyBinding.on('ArrowLeft', setDirection(2));
  data.keyBinding.on('ArrowRight', setDirection(3));
  // =====================================================
  data.keyBinding.on('space', () => {
    console.log('space');
    onSwitchState(!game.isStop);
  });
}

function initCreate(canvas: HTMLCanvasElement) {
  const { width, height } = canvasStyle.value;
  data.core = new Create(canvas, canvasStyle.value);
  data.core.on('FPS', console.log);
  // 添加背景
  data.core.insert(new GameBackgroundBlock(width, height, 10));
  // 初始化边界
  data.core.run();
  // 初始化蛇
  initSnake();
}

// =====================================================
function initSnake() {
  data.snake = new Snake(<Create>data.core, data.border, data.blockSize);
  data.snake.timer = 180;
  const snakePoints = Array.from({ length: 10 }).map((_, i) => ({ x: 1, y: i + 1 }));
  data.snake?.addChild(...snakePoints);
  data.snake.direction = 1;
  data.snake.on('crash', hasCrashState);
}

// =====================================================
function hasCrashState(items: any[]) {
  if (data.snake?.isChild(items[0])) {
    // 游戏结束
    onSwitchState(true);
  }
}

const onSwitchState = debounce(function onSwitchState(isStop: boolean) {
  game.isStop = isStop;
  if (game.isStop) {
    data.core?.stop();
    data.snake?.stop();
  } else {
    data.core?.run();
    data.snake?.start();
  }
}, 50);
</script>

<style lang="scss" src="./style.scss"/>
