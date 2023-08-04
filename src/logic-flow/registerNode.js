import LogicFlow, {
    BaseNodeModel,
    ConnectRule,
    CircleNodeModel,
    CircleNode,
    EllipseNodeModel,
    EllipseNode,
    h,
    RectNode,
    RectNodeModel,
    PolygonNode,
    PolygonNodeModel,
  } from '@logicflow/core';
  
  export default function RegisteNode(lf) {
    /**
     * STEP
     */
    class StepNode extends RectNode {

    }

    class StepNodeModel extends RectNodeModel {

    }

    lf.register({
      type: 'STEP',
      view: StepNode,
      model: StepNodeModel,
    })

    /**
     * IFEL
     */
    class IfelNodeModel extends PolygonNodeModel { 
      getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = "#3CB371";
        style.fill = "#d5e8d4";
        return style;
      }
    }
    lf.register({
      type: 'IFEL',
      view: PolygonNode,
      model: IfelNodeModel,
    });

    /**
     * SWITCH
     */
    class SwitchNodeModel extends EllipseNodeModel  {
      
    }
    lf.register({
      type: 'SWITCH',
      view: EllipseNode,
      model: SwitchNodeModel,
    })

    /**
     * FOR
     */
    class ForNodeModel extends CircleNodeModel {
      // getNodeStyle() {
      //   const style = super.getNodeStyle();
      //   style.stroke = "#3CB371";
      //   style.fill = "red";
      //   return style;
      // }
    }
    lf.register({
      type: 'FOR',
      view: CircleNode,
      model: ForNodeModel,
    })


    // class ApplyNodeModel extends CircleNodeModel {
    //   getConnectedTargetRules() {
    //     const rules = super.getConnectedTargetRules();
    //     const geteWayOnlyAsTarget = {
    //       message: '开始节点只能连出，不能连入！',
    //       validate: (source, target) => {
    //         let isValid = true;
    //         if (target) {
    //           isValid = false;
    //         }
    //         return isValid;
    //       },
    //     };
    //     rules.push(geteWayOnlyAsTarget);
    //     return rules;
    //   }
    // }
    // lf.register({
    //   type: 'apply',
    //   view: CircleNode,
    //   model: ApplyNodeModel,
    // })
  
    // class ApproverNode extends RectNode {
    //   static extendKey = 'UserTaskNode';
    //   getLabelShape() {
    //     const {
    //       x,
    //       y,
    //       width,
    //       height,
    //       properties,
    //     } = this.props.model;
    //     const { labelColor, approveTypeLabel } = properties;
    //     return h(
    //       'text',
    //       {
    //         fill: labelColor,
    //         fontSize: 12,
    //         x: x - width / 2 + 5,
    //         y: y - height / 2 + 15,
    //         width: 50,
    //         height: 25
    //       },
    //       approveTypeLabel,
    //     );
    //   }
    //   getShape() {
    //     const {
    //       x,
    //       y,
    //       width,
    //       height,
    //       radius,
    //     } = this.props.model;
    //     const style = this.props.model.getNodeStyle();
    //     return h(
    //       'g',
    //       {
    //       },
    //       [
    //         h(
    //           'rect',
    //           {
    //             ...style,
    //             x: x - width / 2,
    //             y: y - height / 2,
    //             rx: radius,
    //             ry: radius,
    //             width,
    //             height,
    //           },
    //         ),
    //         this.getLabelShape(),
    //       ],
    //     );
    //   }
    // }
    // class ApproverModel extends RectNodeModel { 
    //   constructor(data, graphModel) {
    //     super(data, graphModel);
    //     this.properties = {
    //       labelColor: '#000000',
    //       approveTypeLabel: '',
    //       approveType: ''
    //     }
    //   }
    // }
  
    // lf.register({
    //   type: 'approver',
    //   view: ApproverNode,
    //   model: ApproverModel,
    // })
  
    // class JugementModel extends PolygonNodeModel { 
    //   constructor(data, graphModel) {
    //     super(data, graphModel);
    //     this.points= [
    //       [35, 0],
    //       [70, 35],
    //       [35, 70],
    //       [0, 35],
    //     ];
    //     this.properties = {
    //       api: '',
    //     }
    //   }
    // }
    // lf.register({
    //   type: 'jugement',
    //   view: PolygonNode,
    //   model: JugementModel,
    // });
  
    // class FinshNodeModel extends CircleNodeModel {
    //   getConnectedSourceRules() {
    //     const rules = super.getConnectedSourceRules();
    //     const geteWayOnlyAsTarget = {
    //       message: '结束节点只能连入，不能连出！',
    //       validate: (source) => {
    //         let isValid = true;
    //         if (source) {
    //           isValid = false;
    //         }
    //         return isValid;
    //       },
    //     };
    //     // @ts-ignore
    //     rules.push(geteWayOnlyAsTarget);
    //     return rules;
    //   }
    // }
    // lf.register({
    //   type: 'finsh',
    //   view: CircleNode,
    //   model: FinshNodeModel,
    // })
  }