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
    style.fill = '#dae8fc'
    style.stroke = '#6c8ebf'

    return getShapeStyleFuction(style, properties)
  }

}
export default {
  type: 'STEP',
  view: RectNode.view,
  model: RectRadiusModel
}