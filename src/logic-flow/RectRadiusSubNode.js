import RectNode from './RectNode'
import { getShapeStyleFuction, getTextStyleFunction } from './getShapeStyleUtil'

// 带圆角的矩形
class RectRadiusModel extends RectNode.model {
  setAttributes () {
    super.setAttributes()
    this.radius = 8
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    const properties = this.getProperties()
    style.fill = '#fff'
    style.stroke = '#000'

    return getShapeStyleFuction(style, properties)
  }

}
export default {
  type: 'SUB',
  view: RectNode.view,
  model: RectRadiusModel
}