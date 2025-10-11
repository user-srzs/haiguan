import { RectNode, RectNodeModel, h } from "@logicflow/core";

// 提供节点
class CustomRectNode extends RectNode {
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, radius, properties } = model;
    const { fill, stroke, strokeWidth } = model.getNodeStyle();
    // 获取父类的默认形状
    const defaultShape = super.getShape();
    // 添加文本元素
    const textElement = h('text', {
      x: x,
      y: y - height / 2 + 20,
      textAnchor: 'middle',
      dominantBaseline: 'central',
      fontSize: '12',
      fill: 'var(--el-color-primary)',
      fontWeight: 'bold',
    }, properties?.visualizationRegionName || '');
    // 如果默认形状是数组，添加文本；如果是单个元素，包装成数组
    if (Array.isArray(defaultShape.children)) {
      return h('g', {}, [...defaultShape.children, textElement]);
    } else {
      return h('g', {}, [defaultShape, textElement]);
    }
  }
}

// 提供节点的属性
class CustomRectModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    /**
     * 实际就是对于图形SVG的属性
     * http://logic-flow.org/guide/basic/node.html#%E8%AE%A4%E8%AF%86logicflow%E7%9A%84%E5%9F%BA%E7%A1%80%E8%8A%82%E7%82%B9
     */
    //this.width = 60;
    //this.height = 50;
  }
  // getNodeStyle() {
  //   const style = super.getNodeStyle();
  //   // style.stroke = '#2987ff';
  //   return style;
  // }
}

export default {
  type: "CustomRect",
  view: CustomRectNode,
  model: CustomRectModel
}