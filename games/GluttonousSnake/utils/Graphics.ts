import { Create, Shape, Point, Listener } from 'tig-core/src';
import { AnimationFrame, getTime } from './Animation.ts';

const boxSize = 10;

export class SnakeItem extends Shape {
  public radii: number;

  public head: boolean = false;

  constructor(left: number, top: number, radii = 1, head = false) {
    super();
    this.top = top;
    this.left = left;
    this.head = head;
    this.radii = radii;
    this.addChild(new Point(0, 0));
  }

  setHead(head: boolean) {
    this.head = head;
    this.update();
  }

  get size() {
    return { width: boxSize, height: boxSize };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    if (this.head) {
      ctx.fillStyle = 'rgba(255, 73, 73, 0.8)';
      ctx.strokeStyle = 'rgba(255, 73, 73, 0.8)';
    }
    ctx.lineWidth = 1;
    ctx.strokeRect(1.5, 1.5, boxSize - 3, boxSize - 3);
    ctx.roundRect(2.5, 2.5, boxSize - 5, boxSize - 5, 1);
    ctx.fill();
  }
}

// TODO: 蛇
export class Snake {
  private readonly core: Create;

  // TODO: 时间间隔
  public timer: number = 240;

  // TODO: 上一次的方向
  private lestDirection: 0 | 1 | 2 | 3 | -1 = -1;

  // TODO: 方向 0: 上, 1: 下, 2: 左, 3: 右
  public _direction: 0 | 1 | 2 | 3 = 0;
  get direction() {
    return this._direction;
  }

  set direction(value) {
    if (this.lestDirection === 0 && value === 1) return;
    if (this.lestDirection === 1 && value === 0) return;
    if (this.lestDirection === 2 && value === 3) return;
    if (this.lestDirection === 3 && value === 2) return;
    this._direction = value;
  }

  // TODO: 是否停止
  private isStop = true;

  // TODO: 子类
  private children: SnakeItem[] = [];

  // TODO: 监听器
  private readonly listener = new Listener();

  // TODO: 长
  private lestTime: number = 0;

  // TODO: 大小
  private boxSize: { width: number; height: number };

  get length() {
    return this.children.length;
  }

  constructor(core: Create, width: number, height: number) {
    this.core = core;
    this.boxSize = { width: Math.ceil(width / boxSize), height: Math.ceil(height / boxSize) };
    //
    Object.defineProperty(this, 'listener', { enumerable: false });
  }

  // TODO: 添加子项
  public addChild(x: number, y: number) {
    const snake = new SnakeItem(x * boxSize, y * boxSize, 2, true);
    this.children[0]?.setHead(false);
    this.children.unshift(snake);
    //
    const crash = this.core.crashDetection(snake);
    if (crash.length) this.listener.publish('crash', crash);
    //
    this.core.insert(snake);
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
    let [x, y] = [head.left / boxSize, head.top / boxSize];
    switch (this.direction) {
      case 0: { // 上
        y -= 1;
        y = y < 0 ? this.boxSize.height - 1 : y;
        break;
      }
      case 1: { // 下
        y += 1;
        y = y >= this.boxSize.height ? 0 : y;
        break;
      }
      case 2: { // 左
        x -= 1;
        x = x < 0 ? this.boxSize.width - 1 : x;
        break;
      }
      case 3: { // 右
        x += 1;
        x = x >= this.boxSize.width ? 0 : x;
        break;
      }
    }
    this.lestDirection = this.direction;
    const foot = this.children.pop();
    foot?.remove();
    this.addChild(x, y);
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

  public on(key: 'move' | 'crash', listener: (data: any) => void) {
    this.listener.subscribe(key, listener);
  }

  public off(key: 'move' | 'crash', listener: (data: any) => void) {
    this.listener.unsubscribe(key, listener);
  }
}
