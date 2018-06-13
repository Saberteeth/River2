import View from '../class/View';
import iContainer from '../interface/iContainer';
import iLayout from '../interface/iLayout';
import ViewType from '../enum/ViewType';
import TouchEvent from '../interface/TouchEvent';

export default class Container extends View implements iContainer {
  private _children: Array<View>;
  private _actionChild: View | null;

  private _layout: iLayout;

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
  set layout(l: iLayout) {
    this._layout = l;
  }

  get layout(): iLayout {
    return this._layout;
  }

  upDataLayout() {
    if (this._layout) {
      this._layout.useLayout();
    }
  }

  get children(): Array<View> {
    return this._children;
  }

  contianerDraw(ctx: CanvasRenderingContext2D | null) {
    this.draw(ctx);
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      if (child.nowType == ViewType.CHANGE) {
        if (child instanceof Container) {
          child.contianerDraw(child.canvas.getContext('2d'));
        } else {
          child.draw(child.canvas.getContext('2d'));
        }
      }

      if (this.ctx)
        this.ctx.drawImage(child.canvas, child.left, child.top);
    }
  }

  cleanChildren() {
    this._children.splice(0, this._children.length);
  }

  hasID(v: View): boolean {
    for (var i = 0; i < this._children.length; i++) {
      if (v.id && v.id == this._children[i].id) {
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
    if (!this.hasID(v) && v.addParent(this.parent) && v.addContainer(this)) {
      this._children.push(v);
      v.nowType = ViewType.CHANGE;
      this.nowType = ViewType.CHANGE;
      return true;
    }

    return false;
  }

  get maxIndex(): number {
    var index = this._children.length - 1;
    if (index > 0) {
      return this._children.length - 1;
    } else {
      return 0;
    }

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

    this.nowType = ViewType.CHANGE;
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

  /**
   * 清除触发对象
   */
  cleanAction() {

    if (this._actionChild instanceof Container) {

      if (this._actionChild == this) {

      } else {
        (<Container>this._actionChild).cleanAction();
      }
    }

    this._actionChild = null;
  }

  constructor() {
    super();
    this._children = new Array;
  }

  /**
   * 事件分发,不建议调用
   */
  issue(e: TouchEvent): boolean {
    e.offX -= this.left;
    e.offY -= this.top;

    if (this._actionChild) {
      if (this._actionChild instanceof Container) {

        if (this._actionChild == this) {
          e.offX += this.left;
          e.offY += this.top;
          return this.onTouchEvent(e);
        }

        return (<Container>this._actionChild).issue(e);
      } else {
        return this._actionChild.onTouchEvent(e);
      }
    }

    for (var i = this._children.length - 1; i >= 0; i--) {
      var child = this._children[i];
      if (e.offX > child.left && e.offX < child.right && e.offY > child.top && e.offY < child.bottom) {
        if (child instanceof Container) {
          if ((<Container>child).issue(e)) {
            this._actionChild = child;
            return true;
          } else {
            continue;
          }
        } else {
          if (child.onTouchEvent(e)) {
            this._actionChild = child;
            return true;
          } else {
            continue;
          }
        }
      }
    }

    e.offX += this.left;
    e.offY += this.top;
    if (this.onTouchEvent(e)) {
      this._actionChild = this;
      return true;
    }

    return false;
  }
}
