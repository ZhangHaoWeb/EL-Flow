import { EllipseResize } from '@logicflow/extension'
import { getShapeStyleFuction, getTextStyleFunction } from './getShapeStyleUtil'

// 圆形
class WhileNewModel extends EllipseResize.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.rx = 35
    this.ry = 35
  }

  setToBottom () {
    this.zIndex = 0
  }

  getNodeStyle () {
    const style = super.getNodeStyle()
    const properties = this.getProperties()
    style.fill = '#E1D5E7'
    style.stroke = '#9673A6'

    return getShapeStyleFuction(style, properties)
  }

  getTextStyle () {
    const style = super.getTextStyle()
    const properties = this.getProperties()
    return getTextStyleFunction(style, properties)
  }
}

export default {
  type: 'WHILE',
  view: EllipseResize.view,
  model: WhileNewModel
}