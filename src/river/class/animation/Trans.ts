import iAnimations from '../../interface/iAnimations';
import * as view from '../output';

export default class Trans implements iAnimations {
  private runX: number = 0;
  private runY: number = 0;
  private runID: NodeJS.Timer;

  over: (v: view.View) => void;
  play(startX: number, endX: number, startY: number, endY: number, time: number, v: view.View) {
    if (this.runX == 0 && this.runY == 0) {
      var offX = endX - startX;
      var offY = endY - startY;

      var sX = offX / (time / 10);
      var sY = offY / (time / 10);

      v.left = startX;
      v.top = startY;
      clearTimeout(this.runID);
      this.run(sX, sY, v, offX, offY, endX, endY);
    }
  }

  private run(sX: number, sY: number, v: view.View, offX: number, offY: number, endX: number, endY: number) {

    this.runID = setTimeout(() => {
      v.top += sY;
      v.left += sX;
      this.runX += sX;
      this.runY += sY;

      if (Math.abs(this.runX) >= Math.abs(offX) &&  Math.abs(this.runY) >= Math.abs(offY)) {
        v.top = endY;
        v.left = endX;
        this.runX = 0;
        this.runY = 0;
        if (this.over) {
          this.over(v);
        }
        return;
      }

      this.run(sX, sY, v, offX, offY, endX, endY);
    }, 10)
  }
}
