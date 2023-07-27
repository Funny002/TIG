import { Style } from '@/utils/Core/Style.ts';

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export abstract class Paths {
  protected _parent?: Graphics;
  public points: Array<Point> = []; // 锚点
  public visible: boolean = true; // 是否可见
  public dragged: boolean = false; // 拖拽
  public selected: boolean = false; // 是否选中
  public readonly: boolean = false; // 是否只读
  public style: Style = new Style(); // 样式

  public addPoint(x: number, y: number) {
    this.points.push(new Point(x, y));
  }

  protected abstract draw(): void;

  remove() {
    const children = this.parent?.children;
    if (children) children.splice(children.indexOf(this), 1);
  }

  get parent(): Graphics | undefined {
    return this._parent;
  }

  set parent(parent: Graphics) {
    this._parent = parent;
  }
}

export class Line extends Paths {
  draw() {
  }
}

export class Shape extends Paths {
  draw() {
  }
}

export class Graphics {
  protected __children: Paths[] = [];

  addShape(shape: Paths) {
    this.__children.push(shape);
    shape.parent = this;
  }

  get children() {
    return this.__children;
  }
}
