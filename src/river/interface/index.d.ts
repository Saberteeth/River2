import iAnimationsFace from './iAnimations';
import iContainerFace from './iContainer';
import iLayoutFace from './iLayout';
import iTouchEventFace from './TouchEvent';

export = iFace;
export as namespace iFace;

declare namespace iFace {
  type iAnimations = iAnimationsFace
  type iContainer = iContainerFace
  type iLayout = iLayoutFace
  type TouchEvent = iTouchEventFace
}
