import view from '../river/class';
import widget from '../river/widget/widget';
export class MainActivity extends view.Activity {
  private btn: widget.Button;

  public onCreate() {
    let size = 0;
    this.btn = this.createBtn(() => {
      this.btn.txt = `${size++ % 10}`
    });
    this.addChild(this.btn);
  }

  private createBtn(action: () => void, width: number = 100, height: number = 50, txt: string = '0-9', bg: string = "btn.png", bgPress: string = "btn_press.png"): widget.Button {
    const btn = new widget.Button();
    btn.txt = txt;
    btn.width = width;
    btn.height = height;
    btn._btn_bg.src = bg;
    btn._btn_bg_press.src = bgPress;
    btn.addClickEvent(action);
    return btn;
  }
}

export function createActivity(id: string) {
  return new MainActivity(<HTMLCanvasElement>document.getElementById(id));
}

export default createActivity;


