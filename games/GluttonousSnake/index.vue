<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="1" autofocus>
    <canvas ref="canvas" :width="canvasStyle.width" :height="canvasStyle.height" :style="{width: canvasStyle.width + 'px', height: canvasStyle.height + 'px'}"/>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { GameBackgroundLine } from '@games/utils/Graphics.ts';
import { computed, onMounted, reactive, ref } from 'vue';
import { Keyboard } from '@utils/keyboard.ts';
import { Snake } from './utils/Graphics.ts';
import { Create } from 'tig-core/src';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const data = reactive<{
  core: Create | null;
  snake: Snake | null;
  blockSize: number;
  keyBinding: Keyboard | null;
  border: { width: number; height: number; }
}>({
  core: null,
  snake: null,
  blockSize: 10,
  keyBinding: null,
  border: { width: 80, height: 40 },
});

// 实际盒子大小
const canvasStyle = computed(() => {
  const { width, height } = data.border;
  return { width: width * data.blockSize, height: height * data.blockSize };
});

onMounted(() => {
  if (root.value) initKeyBinding(root.value);
  if (canvas.value) initCreate(canvas.value);
});

function initKeyBinding(dom: HTMLDivElement) {
  data.keyBinding = new Keyboard(dom);
  let timeout: NodeJS.Timeout | null = null;

  function setDirection(dir: 0 | 1 | 2 | 3) {
    return function () {
      if (!data.snake) return;
      const snake = data.snake;
      // 长按加速
      if (snake.direction === dir) {
        snake.timer = 100;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          snake.timer = 240;
          timeout = null;
        }, 100);
      }
      // 方向变更
      snake.direction = dir;
    };
  }

  data.keyBinding.on('ArrowUp', setDirection(0));
  data.keyBinding.on('ArrowDown', setDirection(1));
  data.keyBinding.on('ArrowLeft', setDirection(2));
  data.keyBinding.on('ArrowRight', setDirection(3));
}

function initCreate(canvas: HTMLCanvasElement) {
  const { width, height } = canvasStyle.value;
  data.core = new Create(canvas, canvasStyle.value);
  data.core.on('FPS', console.log);
  // 添加背景
  data.core.insert(new GameBackgroundLine(width, height, 10));
  data.core.run();
  // 初始化蛇
  initSnake();
}

// =====================================================
function initSnake() {
  // data.snake = new Snake(<Create>data.core, data.border, data.blockSize);
  // for (let i = 10; i > 0; i--) {
  //   data.snake.addChild(1, 1 + i);
  // }
  // data.snake.start();
  // data.snake.on('crash', items => {
  //   console.log('crash', items);
  //   if (data.snake?.isChild(items[0])) {
  //     data.snake?.stop();
  //     // 游戏结束
  //   }
  // });
}
</script>

<style lang="scss">
.var-GluttonousSnake {
  width: 100%;
  height: 100%;
  outline: none;

  > canvas {
    border: 1px solid #bbb;
    box-sizing: content-box;
  }
}
</style>
