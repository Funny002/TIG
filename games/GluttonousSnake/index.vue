<template>
  <div class="var-GluttonousSnake" ref="root" tabindex="1" autofocus="autofocus" @blur.stop="onSwitchState(true)">
    <div class="var-GluttonousSnake__content" :style="{width: canvasStyle.width + 20 + 'px'}">
      <div class="var-GluttonousSnake__header">
        <div class="var-GluttonousSnake__header--item">食物：{{ game.score }}</div>
        <div class="var-GluttonousSnake__header--item">时间：{{ numberToDate(game.runTime) }}</div>
      </div>
      <canvas ref="canvas" :width="canvasStyle.width" :height="canvasStyle.height" :style="{width: canvasStyle.width + 'px', height: canvasStyle.height + 'px'}"/>
    </div>
    <div class="var-tips" v-show="game.isStop" style="pointer-events: none;">
      <div class="var-tips__header">{{ game.over ? '游戏结束' : '提示' }}</div>
      <template v-if="game.over">
        <div class="var-tips__content">
          <div>您已死亡，原因是撞到了<span class="is-btn">{{ ({ snake: '自身', walls: '墙' }[game.over]) }}</span></div>
          <div>游玩了<span class="is-btn">{{ numberToDate(game.runTime) }}</span>，吃掉了<span class="is-btn">{{ game.score }}</span>个食物。</div>
        </div>
        <div class="var-tips__header" style="margin-top: 10px;">刷新页面重新开始游戏</div>
      </template>
      <div class="var-tips__content" v-else>按下<span class="is-btn">空格键</span>可<span class="is-btn">开始/暂停</span>游戏</div>
    </div>
  </div>
</template>

<script lang="ts">export default { name: 'Gluttonous Snake' };</script>
<script setup lang="ts">
import { GameBackgroundBlock, GameBlock } from '@games/utils/Graphics.ts';
import { computed, onMounted, reactive, ref } from 'vue';
import { Keyboard } from '@utils/keyboard.ts';
import { Create, debounce } from 'tig-core';
import { ScoreBlock, Snake } from './utils/Graphics.ts';
import { randomNum } from '@utils/random.ts';

const root = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

interface DataState {
  blockSize: number;
  core: Create | null;
  snake: Snake | null;
  keyBinding: Keyboard | null;
  border: { width: number; height: number; };
}

interface GameState {
  walls: any[];
  score: number;
  timer: number;
  isStop: boolean;
  runTime: number;
  scoreBlock: ScoreBlock | null;
  scoreMap: Map<string, boolean>;
  over: 'snake' | 'walls' | false;
}

interface GameTimeState {
  start: number;
  pause: number;
  total: number;
  timeout: NodeJS.Timeout | null;
}

const data = reactive<DataState>({ core: null, snake: null, blockSize: 10, keyBinding: null, border: { width: 52, height: 32 } });

const game = reactive<GameState>({ score: 0, walls: [], timer: 190, over: false, isStop: true, runTime: 0, scoreBlock: null, scoreMap: new Map() });
const gameTime = reactive<GameTimeState>({ start: 0, pause: 0, total: 0, timeout: null });

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
    if (game.over) return;
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
  initBorder(<any>data.core);
  // 启动画布
  data.core.run();
  // 初始化蛇
  initSnake();
  // 开始记录时间
  gameTime.timeout = setInterval(() => {
    const { start, pause, total } = gameTime;
    const time = Date.now();
    if (start) {
      const newPause = pause ? time - pause : 0;
      game.runTime = Math.floor(((time - start - newPause - total) / 1000));
    } else {
      game.runTime = 0;
    }
    // 蛇存在
    if (data.snake) {
      if (game.runTime > 180 && game.runTime % 180 === 1) {
        game.timer = Math.max(40, game.timer - 10);
        data.snake.timer = game.timer;
      }
    }
  }, 1000);
}

// =====================================================
function setScoreBlock() {
  const snakeMap = (data.snake?.getSnakeMap() || []).map(({ x, y }) => `${ x }-${ y }`);
  const list = Array.from(game.scoreMap.keys()).filter(key => !snakeMap.includes(key));
  const [x, y] = list[randomNum(0, list.length - 1)].split('-').map(Number);
  const newBlock = data.blockSize + 1;
  if (!game.scoreBlock) {
    game.scoreBlock = new ScoreBlock(x * newBlock, y * newBlock, data.blockSize, '#f00');
  } else {
    game.scoreBlock.top = y * newBlock;
    game.scoreBlock.left = x * newBlock;
    game.scoreBlock.removeChild(game.scoreBlock.index);
  }
  data.core?.insert(<any>game.scoreBlock);
}

function initBorder(core: Create) {
  const { blockSize, border: { width, height } } = data;
  const color = '#bbb';
  const newBlock = blockSize + 1;
  for (let i = 0; i < width; i++) {
    const block_1 = new GameBlock(i * newBlock, 0, blockSize, color);
    const block_2 = new GameBlock(i * newBlock, (height - 1) * newBlock, blockSize, color);
    core.insert(block_1);
    core.insert(block_2);
    game.walls.push(block_1, block_2);
  }
  for (let i = 1; i < height - 1; i++) {
    const block_1 = new GameBlock(0, i * newBlock, blockSize, color);
    const block_2 = new GameBlock((width - 1) * newBlock, i * newBlock, blockSize, color);
    core.insert(block_1);
    core.insert(block_2);
    game.walls.push(block_1, block_2);
  }
  // 格子状态
  for (let width = 1; width < data.border.width - 2; width++) {
    for (let height = 1; height < data.border.height - 2; height++) {
      game.scoreMap.set(`${ width }-${ height }`, true);
    }
  }
}

function initSnake() {
  data.snake = new Snake(<Create>data.core, data.border, data.blockSize);
  data.snake.timer = game.timer;
  data.snake.autoAddChild(2);
  data.snake.addChild({ x: 1, y: 1 });
  data.snake.direction = 1;
  data.snake.on('crash', hasCrashState);
}

// =====================================================
function hasCrashState(items: any[]) {
  items.forEach(item => {
    // 撞 ·墙· 了
    if (game.walls.includes(item)) return GameOver('walls');
    // 撞 ·蛇· 了
    if (data.snake?.isChild(item)) return GameOver('snake');
    // 撞 ·食物· 了
    if (game.scoreBlock === item) {
      game.score += 1;
      setScoreBlock(); // 移动食物
      data.snake?.autoAddChild(1); // 增加蛇身
    }
  });
}

function GameOver(type: 'snake' | 'walls') {
  game.over = type;
  onSwitchState(true);
  if (gameTime.timeout) clearInterval(gameTime.timeout);
}

const onSwitchState = debounce(function onSwitchState(isStop: boolean) {
  game.isStop = isStop;
  if (game.isStop) {
    gameTime.pause = Date.now();
  } else {
    if (!gameTime.start) gameTime.start = Date.now();
    if (gameTime.start && gameTime.pause) {
      gameTime.total += Date.now() - gameTime.pause;
      gameTime.pause = 0;
    }
  }
  if (game.isStop) {
    data.core?.stop();
    data.snake?.stop();
  } else {
    data.core?.run();
    data.snake?.start();
  }
  if (!game.scoreBlock && !game.isStop) setScoreBlock();
}, 50);

// utils
function numberToDate(value: number) {
  const s = (value % 60).toString().padStart(2, '0');
  const m = Math.floor(value / 60).toString().padStart(2, '0');
  const h = Math.floor(value / 3600).toString().padStart(2, '0');
  return `${ h }:${ m }:${ s }`;
}
</script>

<style lang="scss" src="./style.scss"/>
