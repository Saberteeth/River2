/**
     * 继承至Event，作为增强字段作用。
     */
    export default interface TouchEvent extends Event {
      /**
       * 局部偏移量x
       */
      offsetX: number;
      /**
       * 局部偏移量y
       */
      offsetY: number;
      /**
       * 全局偏移量x
       */
      clientX: number;
      /**
       * 全局偏移量y
       */
      clientY: number;
      /**
       * 获取touch中的数据保存对象
       */
      changedTouches: any;
      /**
       * 鼠标悬浮状态类型，等同于event中的.type，不同处是额外添加了end状态表示滑动离开悬浮区域
       */
      touchType: string;

      offX: number;
      offY: number;
  }
