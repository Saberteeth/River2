

import view from '../class';
import iPen from '../class/iPen';

module widget {
  /**
   * 提供按钮功能
   */
  export class Button extends view.View {
    _btn_bg: HTMLImageElement;
    _btn_bg_press: HTMLImageElement;
    private _clickFun: () => void;
    private _txt: string = 'Button';
    private _txtColor: string = 'black';
    private _txtFont: number = 14;
    private _pen: iPen;


    set txt(s: string) {
      this._txt = s;
      this.sUpdata();
    }

    get txt(): string {
      return this._txt;
    }

    set txtColor(s: string) {
      this._txtColor = s;
      this.sUpdata();
    }

    get txtColor(): string {
      return this._txtColor;
    }

    set txtFont(n: number) {
      this._txtFont = n;
      this.sUpdata();
    }

    get txtFont(): number {
      return this._txtFont;
    }

    addClickEvent(fun: () => void) {
      this._clickFun = fun;
    }

    constructor() {
      super();
      this._pen = new iPen(this.canvas);
      this.width = 60;
      this.height = 30;

      this._btn_bg = new Image();
      this._btn_bg.src = 'src/lib/img/btn.png';

      this._btn_bg_press = new Image();
      this._btn_bg_press.src = 'src/lib/img/btn_press.png';

      this.setBackGround(this._btn_bg);

      this.onDraw = (ctx) => {
        if(!ctx) return;
        this._pen.readDraw(this._txtColor, 1);
        ctx.font = this._txtFont + 'px SimHei';
        var w = ctx.measureText(this._txt).width;
        var x = (this.width - w) / 2 - 2;
        x = x > 0 ? x : 0;
        ctx.fillStyle = this._txtColor;
        ctx.fillText(this._txt, x, this.height / 2 + this._txtFont / 4, this.width);
        this._pen.drawOver();
      }

      this.addTouchEventListener((e) => {
        switch (e.touchType) {
          case view.View.DOWN:
            this.setBackGround(this._btn_bg_press);
            break;
          case view.View.UP:
            this.setBackGround(this._btn_bg);

            if (this.parent && this._clickFun && e.target == this.parent.canvas && e.offX > this.left && e.offX < this.right && e.offY > this.top && e.offY < this.bottom) {
              this._clickFun();
            }
            break;
          default:
            break;
        }
        return true;
      });
    }

  }
}

export default widget;
