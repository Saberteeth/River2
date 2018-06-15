import iLayout from './iLayout';
import View from '../class/view/View';

export default interface iContainer {
  height: number;
  width: number;

  /**
   * 获取子对象集合
   */
  children: Array<View>;
  /**
   * 设置布局器
   */
  layout: iLayout;
  /**
   * 使用布局
   */
  upDataLayout():void;
  /**
   * 刷新子对象
   */
  sUpdataViews(clazzs: Array<Function>):void;
  /**
  * 交换两个点位置
  */
  changeChildIndex(nowIndex: number, newIndex: number):void;
  /**
   * 是否存在ID
   */
  hasID(v: View): boolean
  /**
   * 根据ID获得视图，注意该id有包含关系的，即在不同的container可以拥有相同的id
   */
  getViewByID(id: string): View | null
  /**
   * 添加显示对象
   */
  addChild(v: View): boolean
  /**
   * 获取最大子对象位置，如果没有就返回-1
   */
  maxIndex: number
  /**
  * 交换两个点位置
  */
  changeChildIndex(nowIndex: number, newIndex: number):void;
  /**
  * 移除显示对象
  */
  removeChild(v: View):void;
  /**
   * 获取对象在子类中的叠放次序，既索引
   */
  getChildIndex(v: View): number

  removeChildrenByClass(clazzs: Array<Function>):void;
}
