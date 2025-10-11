// CustomRectNode.js
import { CircleNode, CircleNodeModel, h } from "@logicflow/core";

// 提供节点 svg dom
class CustomCircleNode extends CircleNode {
    getShape() {
        const { model, graphModel } = this.props;
        const { x, y, r, width,properties } = model
        const { fill, stroke, strokeWidth } = model.getNodeStyle()
        return h('g', {},
          [
              h(
                'circle',
                {
                    cx: x,
                    cy: y,
                    r,
                    fill,
                    stroke,
                    strokeWidth,
                }
              ),
              h(
                'text',
                {
                    x: x - 15,
                    y: y - r + 20,
                },
                properties.visualizationRegionName
              )
          ]
        )
    }
}

// 提供节点的样式
class CustomCircleModel extends CircleNodeModel {

    initNodeData(data) {
        super.initNodeData(data);
        /**
         * 实际就是对于图形SVG的属性
         * http://logic-flow.org/guide/basic/node.html#%E8%AE%A4%E8%AF%86logicflow%E7%9A%84%E5%9F%BA%E7%A1%80%E8%8A%82%E7%82%B9
         */
        //this.r = 30;
    }

    getNodeStyle() {
        const style = super.getNodeStyle();
        // style.stroke = '#2987ff';
        return style;
    }

    getConnectedTargetRules() {
        const rules = super.getConnectedTargetRules();
        const notAsTarget = {
            message: '起始节点不能作为边的终点',
            validate: () => false,
        };
        rules.push(notAsTarget);
        return rules;
    }
}

export default {
    type: "CustomStart",
    view: CustomCircleNode,
    model: CustomCircleModel
}