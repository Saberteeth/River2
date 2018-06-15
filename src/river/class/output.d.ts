import viewClass from './view/View';
import activityClass from './view/Activity';
import containerClass from './view/Container';

export = view;
export as namespace view;

declare namespace view {
  type View = viewClass
  type Activity = activityClass;
  type Container = containerClass;
}
