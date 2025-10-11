import { PolygonNode, PolygonNodeModel, h } from "@logicflow/core";

// 提供节点
class CustomPolygonNode extends PolygonNode {
  getShape() {
    const { model } = this.props;
    const { x, y,height, properties } = model;

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
class CustomPolygonModel extends PolygonNodeModel {
  // getNodeStyle() {
  //   const style = super.getNodeStyle();
  //   // style.stroke = '#2987ff';
  //   return style;
  // }
}

export default {
  type: "CustomPolygon",
  view: CustomPolygonNode,
  model: CustomPolygonModel
}