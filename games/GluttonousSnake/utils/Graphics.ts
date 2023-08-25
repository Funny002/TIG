import { Create, Listener, getTime, AnimationFrame, Shape } from 'tig-core';
import { GameBlock } from '@games/utils/Graphics.ts';

// TODO: 蛇头颜色
const headColor = '#e22';

// TODO: 蛇身颜色
const itemColor = '#000';

// TODO: 蛇
export class Snake {
  private readonly core: Create;

  // TODO: 时间间隔
  public timer: number = 240;

  // TODO: 方块大小
  private readonly block: number;

  // TODO: 上一次的方向
  private lestDirection: 0 | 1 | 2 | 3 | -1 = -1;

  // TODO: 方向 0: 上, 1: 下, 2: 左, 3: 右
  public _direction: 0 | 1 | 2 | 3 = 0;
  get direction() {
    return this._direction;
  }

  // TODO: 设置方向
  set direction(value) {
    if (this.lestDirection === 0 && value === 1) return;
    if (this.lestDirection === 1 && value === 0) return;
    if (this.lestDirection === 2 && value === 3) return;
    if (this.lestDirection === 3 && value === 2) return;
    this._direction = value;
  }

  // TODO: 是否停止
  private isStop = true;

  // TODO: 上一次的时间
  private lestTime: number = 0;

  // TODO: 子类
  private children: GameBlock[] = [];

  // TODO: 监听器
  private readonly listener = new Listener();

  // TODO: 大小
  private readonly blockSize: { width: number; height: number };

  // TODO: 长度
  get length() {
    return this.children.length;
  }

  constructor(core: Create, blockSize: { width: number; height: number }, block: number) {
    this.core = core;
    this.block = block;
    this.blockSize = blockSize;
    Object.defineProperty(this, 'listener', { enumerable: false });
  }

  // TODO: 坐标处理
  private handlerPoint(x: number, y: number) {
    const { width, height } = this.blockSize;
    if (x < 0) x = width - -x;
    if (y < 0) y = height - -y;
    if (x > width) x = x % width;
    if (y > height) y = y % height;
    const newBlock = this.block + 1;
    return { x: x * newBlock, y: y * newBlock };
  }

  private handlerChild(snake: GameBlock) {
    this.children[0]?.setColor(itemColor);
    this.children.unshift(snake);
    //
    const crash = this.core.crashDetection(snake);
    if (crash.length) this.listener.publish('crash', crash);
    this.core.insert(snake);
  }

  // TODO: 添加子项
  public addChild(...points: { x: number, y: number }[]) {
    const list = points.map(({ x, y }) => this.handlerPoint(x, y));
    for (const item of list) {
      this.handlerChild(new GameBlock(item.x, item.y, this.block, headColor));
    }
  }

  // TODO: 自动添加子项
  public autoAddChild(count: number) {
    const { left, top } = this.children[this.length - 1] || {};
    for (let i = 0; i < count; i++) {
      const item = new GameBlock(left, top, this.block, itemColor);
      this.children.push(item);
      this.core.insert(item);
    }
  }
  
  // TODO: 删除子项
  public removeChild(count: number = 1, index?: number) {
    index = typeof index === 'number' ? index : this.length - count;
    this.children.splice(index, count).forEach(item => item.remove());
  }

  // TODO: 移动
  private move() {
    const head = this.children[0];
    if (!head) return;
    const newBlock = this.block + 1;
    let [x, y] = [head.left / newBlock, head.top / newBlock];
    switch (this.direction) {
      case 0: { // 上
        y -= 1;
        y = y < 0 ? this.blockSize.height - 1 : y;
        break;
      }
      case 1: { // 下
        y += 1;
        y = y >= this.blockSize.height ? 0 : y;
        break;
      }
      case 2: { // 左
        x -= 1;
        x = x < 0 ? this.blockSize.width - 1 : x;
        break;
      }
      case 3: { // 右
        x += 1;
        x = x >= this.blockSize.width ? 0 : x;
        break;
      }
    }
    this.lestDirection = this.direction;
    const foot = this.children.pop();
    if (foot) {
      // 脱离画布
      foot.parent?.removeChild(foot.index);
      const point = this.handlerPoint(x, y);
      foot.top = point.y;
      foot.left = point.x;
      foot.setColor('#e22');
      this.handlerChild(foot);
    }
  }

  // TODO: 开始移动
  private startMove() {
    if (this.isStop) return;
    //
    if (this.lestTime) {
      const time = getTime();
      if ((time - this.lestTime) > this.timer) {
        this.move();
        this.lestTime = time;
        this.listener.publish('move', undefined);
      }
    } else {
      this.lestTime = getTime();
    }
    //
    AnimationFrame(this.startMove.bind(this));
  }

  public getSnakeMap() {
    const newBlock = this.block + 1;
    return this.children.map(item => ({ x: item.left / newBlock, y: item.top / newBlock }));
  }

  // TODO: 开始
  public start() {
    this.lestTime = getTime();
    this.isStop = false;
    this.startMove();
  }

  // TODO: 停止
  public stop() {
    this.isStop = true;
  }

  // TODO: 是否为子项
  public isChild(shape: any) {
    return this.children.indexOf(<GameBlock>shape) >= 0;
  }

  // TODO: 添加监听
  public on(key: 'move' | 'crash', listener: (data: any) => void) {
    this.listener.subscribe(key, listener);
  }

  // TODO: 取消监听
  public off(key: 'move' | 'crash', listener: (data: any) => void) {
    this.listener.unsubscribe(key, listener);
  }
}

// TODO: 分数方块 - 创建 ·Shape· 子类
export class ScoreBlock extends Shape {
  private color: string;
  private readonly width: number;

  constructor(left: number, top: number, width: number, color: string = '#849374') {
    super();
    this.top = top;
    this.left = left;
    this.width = width;
    this.color = color;
    this.update();
  }

  get size() {
    const width = this.width;
    return { width, height: width };
  }

  // TODO: 改变颜色
  setColor(color: string) {
    this.color = color;
    this.update();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.translate(this.width / 2, this.width / 2);
    ctx.rotate(45 * Math.PI / 180);
    const newBlock = this.width - 4;
    const point = -Math.round(newBlock / 2);
    ctx.fillStyle = this.color;
    ctx.fillRect(point, point, newBlock, newBlock);
  }
}
