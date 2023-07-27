import { Color } from './Color';

export class Stroke {
  public color?: Color; // 描边颜色
  public width: number = 1; // 描边宽度
  public dash: number[] = []; // 虚线
  public opacity: number = 1;  // 描边透明度
  public lineCap: string = ''; // 线帽
  public lineJoin: string = '';// 线连接
  public miterLimit: number = 0; // 斜接限制
  public dashOffset: number = 0; // 虚线偏移
  public dashed: boolean = false; // 虚线
}

export class DashedStroke extends Stroke {
  constructor(width = 1) {
    super();
    this.width = width;
    this.dashed = true;
  }
}

export class SolidStroke extends Stroke {
  constructor(width = 1) {
    super();
    this.width = width;
  }
}

export class Style {
  public fill?: Color;
  public stroke?: Stroke;
  public rotate: number = 0;
  public opacity: number = 1;
}
