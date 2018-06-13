import ViewType from '../enum/ViewType';
import Container from './Container';
import TouchEvent from '../interface/TouchEvent';
import Activity from '../class/Activity';

/**
     * 显示对象的封装类，同时持有自我绘制能力，如需要自我绘制需为 onDraw: (ctx: CanvasRenderingContext2D) => void;字段赋值
     */
export default class View {

  ignoreLayout: boolean = false;
  /**
   * 触摸开始
   */
  static get DOWN(): string {
    return 'down';
  }
  /**
   * 触摸移动
   */
  static get MOVE(): string {
    return 'move';
  }
  /**
   * 触摸抬起
   */
  static get UP(): string {
    return 'up';
  }

  /**
   * 触摸开始
   */
  static get TOUCH_DOWN(): string {
    return 'touchstart';
  }
  /**
   * 触摸移动
   */
  static get TOUCH_MOVE(): string {
    return 'touchmove';
  }
  /**
   * 触摸抬起
   */
  static get TOUCH_UP(): string {
    return 'touchend';
  }
  /**
   * 点击
   */
  static get MOUSE_DOWN(): string {
    return 'mousedown';
  }
  /**
   * 移动
   */
  static get MOUSE_MOVE(): string {
    return 'mousemove';
  }
  /**
   * 抬起
   */
  static get MOUSE_UP(): string {
    return 'mouseup';
  }
  /**
   * 鼠标悬浮事件
   */
  static get FLOAT_MOVE(): string {
    return 'mousemove';
  }
  /**
   * 鼠标悬浮移出
   */
  static get FLOAT_END(): string {
    return 'end';
  }

  private _id: string = 'null';
  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  private _alpha: number = 1;
  set alpha(a: number) {
    this._alpha = a;
    this.sUpdata();
  }
  get alpha(): number {
    return this._alpha;
  }

  private _img: HTMLImageElement;
  /**
   * 设置纹理背景
   */
  setBackGround(i: HTMLImageElement) {
    this._img = i;
    this.sUpdata();
  }

  /**
   * 获取在activity视图中的次序
   */
  getIndexForParents(): number {
    if (this.parent) {
      return this.parent.getChildIndex(this);
    }

    return -1;
  }

  /**
   * 改变位置
   */
  changeIndexForParents(newIndex: number) {
    if (this.parent) {
      var now = this.parent.getChildIndex(this);
      this.parent.changeChildIndex(now, newIndex);
    }
  }

  /**
   * 显示对象左边距
   */
  left: number;

  /**
   * 显示对象上边距
   */
  top: number;

  /**
   * 显示对象右边距
   */
  get right(): number {
    return this.left + this.width;
  }

  /**
   * 显示对象下边距
   */
  get bottom(): number {
    return this.top + this.height;
  }


  private _nowType: ViewType;
  private _canvas: HTMLCanvasElement;
  private _touchListener: (e: TouchEvent) => boolean;
  private _parent: Activity | null;
  private _container: Container | null;
  private _floatMoveListener: (e: TouchEvent) => boolean;
  private _mouseWheelListener: (e: MouseWheelEvent) => boolean;
  private _ctx: CanvasRenderingContext2D | null;

  /**
   * 获取2d对象
   */
  get ctx(): CanvasRenderingContext2D | null {
    return this._ctx;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  /**
   * 父activity对象
   */
  get parent(): Activity | null {
    if (this.container) {
      return this.container.parent;
    }

    return this._parent;
  }

  get container(): Container | null {
    return this._container;
  }

  /**
   * 此函数由activity控制操作，请避免使用
   */
  addParent(a: Activity | null): boolean {
    if (!this._parent) {
      this._parent = a;
      return true;
    }

    return false;
  }

  addContainer(c: Container): boolean {
    if (!this._container) {
      this._container = c;
      return true;
    }

    return false;
  }

  /**
   * 此函数由activity控制操作，请避免使用
   */
  removeParent() {
    this._parent = null;
    this._container = null;
  }

  /**
   * 宽
   */
  get width(): number {
    return this._canvas.width;
  }

  /**
   * 高
   */
  get height(): number {
    return this._canvas.height;
  }

  set width(w: number) {
    this._canvas.width = w;
  }

  set height(h: number) {
    this._canvas.height = h;
  }

  /**
   * 目前状态
   */
  get nowType(): ViewType {
    return this._nowType;
  }

  set nowType(vt: ViewType) {

    if (this._container && vt == ViewType.CHANGE) {
      this._container.nowType = ViewType.CHANGE;
    }
    this._nowType = vt;
  }

  constructor() {
    this.init();
  }

  private init() {
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this.left = 0;
    this.top = 0;
  }

  /**
   * 添加鼠标点击与触摸事件
   */
  addTouchEventListener(listener: (e: TouchEvent) => boolean) {
    this._touchListener = listener;
  }

  /**
   * 添加鼠标悬浮事件,注float事件中检测对象必须由touchTpye描述事件状态
   */
  addFloatMoveEvent(listener: (e: TouchEvent) => boolean) {
    this._floatMoveListener = listener;
  }

  /**
   * 添加鼠标滚轮事件
   */
  addMouseWheelEventListener(listener: (e: MouseWheelEvent) => boolean) {
    this._mouseWheelListener = listener;
  }

  /**
   * 此函数由activity控制操作，请避免使用
   */
  onTouchEvent(e: TouchEvent): boolean {
    if (this._touchListener)
      return this._touchListener(e);
    else
      return false;
  }

  /**
   * 此函数由activity控制操作，请避免使用
   */
  onFloatEvent(e: TouchEvent): boolean {
    if (this._floatMoveListener)
      return this._floatMoveListener(e);
    else
      return false;
  }

  /**
   * 此函数由activity控制操作，请避免使用
   */
  onMouseWheelEvent(e: MouseWheelEvent): boolean {
    if (this._mouseWheelListener) {
      return this._mouseWheelListener(e);
    } else {
      return false;
    }
  }

  /**
   * 刷新视图
   */
  sUpdata() {
    this.nowType = ViewType.CHANGE;
  }

  /**
   * 绘制自己的字段，通过赋值,注意会优先绘制设置的背景，然后再绘制该项,请避免使用,但是需要赋值
   */
  onDraw: (ctx: CanvasRenderingContext2D | null) => void;

  /**
   * 此函数由activity控制操作，请避免使用
   */
  draw(ctx: CanvasRenderingContext2D | null) {
    if(!ctx) return;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalAlpha = this.alpha;
    if (this._img) {
      if (this._img.complete) {
        ctx.drawImage(this._img, 0, 0, this.width, this.height);
      } else {
        this.nowType = ViewType.CHANGE;
        return;
      }
    }

    if (this.onDraw)
      this.onDraw(ctx);

    this.nowType = ViewType.SUCCESS;

  }
}
