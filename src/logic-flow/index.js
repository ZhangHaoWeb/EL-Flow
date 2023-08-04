import ForNewModel from './ForNode'
import DiamondNode from './DiamondNode'
import ReaceNode from './RectNode'
import ReactRadiusNode from './RectRadiusNode'
import HeptagonNode from './HeptagonNode'
import WhileNode from './WhileNode'
import RectRadiusSubNode from './RectRadiusSubNode'

export const registerCustomElement = (lf) => {
    lf.register(ForNewModel)
    lf.register(WhileNode)
    lf.register(DiamondNode)
    lf.register(ReaceNode)
    lf.register(ReactRadiusNode)
    lf.register(RectRadiusSubNode)
    lf.register(HeptagonNode)
}