import { DiamondResize } from '@logicflow/extension'
import { getShapeStyleFuction, getTextStyleFunction } from './getShapeStyleUtil'

// 菱形
/**
 * model控制初始化的值
 */
class DiamondModel extends DiamondResize.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.rx = 40
    this.ry = 40
  }
  getNodeStyle () {
    const style = super.getNodeStyle()
    const properties = this.getProperties()
    style.fill = '#d5e8d4'
    style.stroke = '#3CB371'
    return getShapeStyleFuction(style, properties)
  }

  getTextStyle () {
    const style = super.getTextStyle()
    const properties = this.getProperties()
    return getTextStyleFunction(style, properties)
  }

  setToBottom () {
    this.zIndex = 0
  }
}

export default {
  type: 'IFEL',
  view: DiamondResize.view,
  model: DiamondModel
}