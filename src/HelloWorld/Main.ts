import view from '../river/class';

import { Move, AnimationUtils } from './Move';


export class MainActivity extends view.Activity {
  private btn: Move;

  public onCreate() {
    this.btn = new Move();
    this.btn.left = this.width / 2 - this.btn.width / 2;
    this.btn.top = this.height / 2 - this.btn.height / 2;
    this.addChild(this.btn);
    AnimationUtils.ALPHA.play(0, 0.5, 1000, this.btn);
  }

}

export function createActivity(id: string) {
  return new MainActivity(<HTMLCanvasElement>document.getElementById(id));
}

export default createActivity;


