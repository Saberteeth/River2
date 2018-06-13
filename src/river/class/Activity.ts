import iContainer from '../interface/iContainer';
import View from '../class/View';
import iLayout from '../interface/iLayout';
import ViewType from '../enum/ViewType';
import Container from '../class/Container';
import TouchEvent from '../interface/TouchEvent';

/**
   * 核心界面控制器，类似于Android中的Activity对象，拥有对添加其中的View对象的控制作用，
   * 并实际控制核心显示canvas的绘制，以及touch等事件分发。
   */
export default class Activity implements iContainer {
  private _children: Array<View>;
  private _activityView: View | null;
  private _lastFloatView: View | null;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D | null;
  private _timers: Array<(dt: number) => void>;
  private _layout: iLayout;

  get children(): Array<View> {
    return this._children;
  }

  set layout(l: iLayout) {
    this._layout = l;
  }

  get layout(): iLayout {
    return this._layout;
  }

  get width(): number {
    return this._canvas.width;
  }

  get height(): number {
    return this._canvas.height;
  }
  /**
   * 获取注入的canvas对象
   */
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  upDataLayout() {
    if (this._layout) {
      this.layout.useLayout();
    }
  }

  sUpdataViews(clazzs: Array<Function>) {
    A: for (var x = 0; x < this._children.length; x++) {
      for (var y = 0; y < clazzs.length; y++) {
        if (this._children[x].constructor == clazzs[y]) {
          this._children[x].sUpdata();
          clazzs.splice(y, 1);
          continue A;
        }
      }
    }
  }

  removeChildrenByClass(clazzs: Array<Function>) {
    A: for (var x = 0; x < this._children.length; x++) {
      for (var y = 0; y < clazzs.length; y++) {
        if (this._children[x].constructor == clazzs[y]) {
          this._children.splice(x, 1);
          x--;
          continue A;
        }
      }
    }
  }

  hasID(v: View): boolean {
    for (var i = 0; i < this._children.length; i++) {
      if (v.id && v.id == this._children[i].id) {
        console.log(v.id + '已经被使用');
        return true;
      }
    }
    return false;
  }

  getViewByID(id: string): View | null {
    for (var i = 0; i < this._children.length; i++) {
      if (id && id == this._children[i].id) {
        return this._children[i];
      }
    }

    return null;
  }

  addChild(v: View): boolean {
    if (!this.hasID(v) && v.addParent(this)) {
      this._children.push(v);
      v.nowType = ViewType.CHANGE;
      return true;
    }

    return false;
  }

  get maxIndex(): number {
    return this._children.length - 1;
  }

  changeChildIndex(nowIndex: number, newIndex: number) {
    var index = newIndex;
    if (index < 0) {
      index = 0;
    } else if (index >= this._children.length) {
      index = this._children.length - 1;
    }

    var child = this._children.splice(nowIndex, 1);
    this._children.splice(index, 0, child[0]);
  }

  getChildIndex(v: View): number {
    for (var i = 0; i < this._children.length; i++) {
      if (v == this._children[i]) {
        return i;
      }
    }

    return -1;
  }

  removeChild(v: View) {
    if (v.parent)
      for (var i = 0; i < this._children.length; i++) {
        if (this._children[i] == v) {
          var child = this._children.splice(i, 1);
          child[0].removeParent();
        }
      }
  }
  /**
   * 添加时间监听器
   */
  addTimer(timer: (dt: number) => void) {
    this._timers.push(timer);
  }

  /**
   * 移除所有时间监听器
   */
  cleanTimer() {
    this._timers.splice(0, this._timers.length);
  }


  constructor(c: HTMLCanvasElement) {
    this._canvas = c;
    this._timers = new Array;
    this._ctx = c.getContext('2d');
    this._children = new Array;
    this.init();
  }

  private init() {
    this.initEvent();
    this.run(this);
  }

  private _lastTime: number = 0;
  private run(a: Activity) {
    if (a._ctx)
      a._ctx.clearRect(0, 0, a._canvas.width, a._canvas.height);
    for (var i = 0; i < a._children.length; i++) {
      var child = a._children[i];
      if (child.nowType == ViewType.CHANGE) {
        if (child instanceof Container) {
          (<Container>child).contianerDraw(child.canvas.getContext('2d'));
        } else {
          child.draw(child.canvas.getContext('2d'));
        }
      }

      if (this._ctx)
        this._ctx.drawImage(child.canvas, child.left, child.top);
    }

    requestAnimationFrame((rt: number) => {
      var dt = rt - this._lastTime;
      this._lastTime = rt;

      for (var i = 0; i < this._timers.length; i++) {
        this._timers[i](dt);
      }

      a.run(a);
    })
  }

  private initEvent() {

    window.ondragstart = () => {
      return false;
    };

    window.addEventListener('mousewheel', (e: MouseWheelEvent) => {

      if (e.target == this._canvas) {
        for (var i = this._children.length - 1; i >= 0; i--) {
          var child = this._children[i];
          if (e.offsetX > child.left && e.offsetX < child.right && e.offsetY > child.top && e.offsetY < child.bottom) {
            if (this._children[i].onMouseWheelEvent(e)) {
              break;
            }
          }
        }
      }
    })

    window.addEventListener(View.MOUSE_DOWN, (e: TouchEvent) => {
      e.offX = e.offsetX;
      e.offY = e.offsetY;

      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }

      //e.touchType
      if (e.target == this._canvas)
        for (var i = this._children.length - 1; i >= 0; i--) {
          var child = this._children[i];
          if (e.offsetX > child.left && e.offsetX < child.right && e.offsetY > child.top && e.offsetY < child.bottom) {
            if (child instanceof Container) {
              if (child.issue(e)) {
                this._activityView = child;
                return;
              } else {
                continue;
              }
            } else {
              if (child.onTouchEvent(e)) {
                this._activityView = child;
                return;
              }
            }
          }
        }
    });

    window.addEventListener(View.TOUCH_DOWN, (e: TouchEvent) => {

      e.clientX = e.changedTouches[0].clientX + document.body.scrollLeft;
      e.clientY = e.changedTouches[0].clientY + document.body.scrollTop;
      e.offX = e.clientX - this.canvas.offsetLeft;
      e.offY = e.clientY - this.canvas.offsetTop;
      e.offsetX = e.offX;
      e.offsetY = e.offY;

      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }


      if (e.target == this._canvas) {
        e.preventDefault();
        for (var i = this._children.length - 1; i >= 0; i--) {
          var child = this._children[i];
          if (e.offsetX > child.left && e.offsetX < child.right && e.offsetY > child.top && e.offsetY < child.bottom) {
            if (child instanceof Container) {
              if (child.issue(e)) {
                this._activityView = child;
                return;
              } else {
                continue;
              }
            } else {
              if (child.onTouchEvent(e)) {
                this._activityView = child;
                return;
              }
            }
          }
        }
      }
    })

    window.addEventListener(View.MOUSE_MOVE, (e: TouchEvent) => {
      e.offX = e.offsetX;
      e.offY = e.offsetY;
      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }

      if (this._activityView) {
        if (this._activityView instanceof Container) {
          (<Container>this._activityView).issue(e);
          return;
        }

        this._activityView.onTouchEvent(e);
        return;
      }

      if (e.target == this._canvas) {
        var child: View | null = null;
        for (var i = this._children.length - 1; i >= 0; i--) {
          child = this._children[i];
          if (e.offsetX > child.left && e.offsetX < child.right && e.offsetY > child.top && e.offsetY < child.bottom) {
            if (child.onFloatEvent(e)) {
              break;
            } else {
              child = null;
            }
          } else {
            child = null;
          }
        }

        if (this._lastFloatView != child) {
          if (this._lastFloatView) {
            e.touchType = View.FLOAT_END;
            this._lastFloatView.onFloatEvent(e);
            this._lastFloatView = null;
          }

          if (child) {
            this._lastFloatView = child;
          }
        }
      }
    });

    window.addEventListener(View.TOUCH_MOVE, (e: TouchEvent) => {
      e.clientX = e.changedTouches[0].clientX + document.body.scrollLeft;;
      e.clientY = e.changedTouches[0].clientY + document.body.scrollTop;;
      e.offX = e.clientX - this.canvas.offsetLeft;
      e.offY = e.clientY - this.canvas.offsetTop;
      e.offsetX = e.offX;
      e.offsetY = e.offY;

      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }

      if (this._activityView) {
        e.preventDefault();
        if (this._activityView instanceof Container) {
          (<Container>this._activityView).issue(e);
        } else {
          this._activityView.onTouchEvent(e);
        }
      }

    })

    window.addEventListener(View.MOUSE_UP, (e: TouchEvent) => {
      e.offX = e.offsetX;
      e.offY = e.offsetY;
      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }

      if (this._activityView) {

        if (this._activityView instanceof Container) {
          (<Container>this._activityView).issue(e);
          (<Container>this._activityView).cleanAction();
        } else {
          this._activityView.onTouchEvent(e);
        }

        this._activityView = null;

      }
    });

    window.addEventListener(View.TOUCH_UP, (e: TouchEvent) => {
      e.clientX = e.changedTouches[0].clientX + document.body.scrollLeft;
      e.clientY = e.changedTouches[0].clientY + document.body.scrollTop;
      e.offX = e.clientX - this.canvas.offsetLeft;
      e.offY = e.clientY - this.canvas.offsetTop;
      e.offsetX = e.offX;
      e.offsetY = e.offY;

      switch (e.type) {
        case View.MOUSE_DOWN:
        case View.TOUCH_DOWN:
          e.touchType = View.DOWN;
          break;
        case View.MOUSE_MOVE:
        case View.TOUCH_MOVE:
          e.touchType = View.MOVE;
          break;
        case View.MOUSE_UP:
        case View.TOUCH_UP:
          e.touchType = View.UP;
          break;
      }

      if (this._activityView) {
        e.preventDefault();
        if (this._activityView instanceof Container) {
          (<Container>this._activityView).issue(e);
          (<Container>this._activityView).cleanAction();
        } else {
          this._activityView.onTouchEvent(e);
        }

        this._activityView = null;
      }
    })
  }
}
