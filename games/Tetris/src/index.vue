<template>
  <div class="var-Tetris" ref="root" tabindex="1" autofocus="autofocus" @blur.stop="onSwitchState(true)">
    <div class="var-Tetris__content">
      <canvas ref="canvas" :width="canvasStyle.width" :height="canvasStyle.height" :style="{width: canvasStyle.width + 'px', height: canvasStyle.height + 'px'}"/>
    </div>
  </div>
</template>

<script lang="ts">export default { name: 'Tetris' };</script>
<script setup lang="ts">
import { GameBackgroundBlock } from '@games/utils/Graphics.ts';
import { computed, onMounted, reactive, ref, inject } from 'vue';
import { Keyboard } from '@utils/keyboard.ts';
import { Create } from 'tig-core';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const themeConfig = inject<{ block: number; color: string; active: string; background: string; }>('theme');
console.log(themeConfig);

interface DataState {
  // fps: number;
  blockSize: number;
  core: Create | null;
  snake: null;
  keyBinding: Keyboard | null;
  border: { width: number; height: number; };
}

const data = reactive<DataState>({ core: null, snake: null, keyBinding: null, blockSize: 10, border: { width: 10, height: 20 } });

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

// =====================================================
function initKeyBinding(element: HTMLElement) {
  data.keyBinding = new Keyboard(element);

  const setDirection = (direction: number) => () => {
    console.log('setDirection', direction);
  };

  data.keyBinding.on('ArrowUp', setDirection(0));
  data.keyBinding.on('ArrowDown', setDirection(1));
  data.keyBinding.on('ArrowLeft', setDirection(2));
  data.keyBinding.on('ArrowRight', setDirection(3));
}

function initCreate(canvas: HTMLCanvasElement) {
  const { width, height } = canvasStyle.value;
  data.core = new Create(canvas, { width, height, limitFps: 60 });
  data.core.on('FPS', console.log);
  // 添加背景
  data.core.insert(new GameBackgroundBlock(width, height, 10));
  // 启动画布
  data.core.run();
  // const shape = new ShapeModel('T', data.blockSize);
  // data.core.insert(shape);
  // setInterval(function () {
  //   shape.onRotate();
  // }, 1000);
}

// =====================================================
function onSwitchState(state: boolean) {
  console.log(state);
}
</script>
