
import view from '../river/class';
import animation from '../river/class/animation';
import * as iFace from '../river/interface';

export class AnimationUtils {
  static ALPHA = new animation.Alpha();
  static TRANS = new animation.Trans();
}

export class Move extends view.View {
  private _bg: HTMLImageElement;
  private _offLeft: number;
  private _offTop: number;

  where(x: number, y: number): string {
    if (!this.parent) return 'bad';
    var offx = this.parent.height / 2 - y;
    var offy = this.parent.width / 2 - x;
    var tb = offx > 0 ? 'top' : 'bottom';
    var lr = offy > 0 ? 'left' : 'right';
    return Math.abs(offx) < Math.abs(offy) ? lr : tb;
  }

  constructor() {
    super();
    this.alpha = 0;
    this.height = this.width = 50;
    this._bg = new Image();
    this._bg.src = 'move_press.png';
    this.setBackGround(this._bg);

    this.addTouchEventListener((e: iFace.TouchEvent) => {
      if (!this.parent) return false;

      switch (e.touchType) {
        case view.View.DOWN:
          AnimationUtils.ALPHA.over = null;
          this._offLeft = e.clientX - this.left;
          this._offTop = e.clientY - this.top;
          AnimationUtils.ALPHA.play(0.5, 1, 150, this);
          break;
        case view.View.MOVE:
          var l = e.clientX - this._offLeft;
          var t = e.clientY - this._offTop;
          l = l < 0 ? 0 : l;
          l = l + this.width > this.parent.width ? this.parent.width - this.width : l;

          t = t < 0 ? 0 : t;
          t = t + this.height > this.parent.height ? this.parent.height - this.height : t;

          this.left = l;
          this.top = t;
          break;
        case view.View.UP:
          switch (this.where(this.left + this.width / 2, this.top + this.height / 2)) {
            case 'left':
              AnimationUtils.TRANS.play(this.left, 0, this.top, this.top, 100, this);
              break;
            case 'right':
              AnimationUtils.TRANS.play(this.left, this.parent.width - this.width, this.top, this.top, 100, this);
              break;
            case 'bottom':
              AnimationUtils.TRANS.play(this.left, this.left, this.top, this.parent.height - this.height, 100, this);
              break;
            case 'top':
              AnimationUtils.TRANS.play(this.left, this.left, this.top, 0, 100, this);
              break;
            default:
              return false;
          }
          AnimationUtils.ALPHA.play(1, 0.5, 150, this);
      }
      return true;
    });
  }
}


export default Move;
