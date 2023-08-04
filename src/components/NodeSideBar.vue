<script setup>
import IconCircle from './icon/Circle.vue'
import IconWhile from './icon/While.vue'
import IconDiamond from './icon/Diamond.vue'
import IconRectRadius from './icon/RectRadius.vue'
import IconHeptagon from './icon/Heptagon.vue'
import IconReactRadiusSub from './icon/RectRadiusSub.vue'

const props = defineProps({
    obj: Object,
    test: Number
})

const dragInNode = (type) => { 
    props.obj.lf.dnd.startDrag({
        type
    })
}

</script>

<template>
    <div class="node-panel">
        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('STEP')">
                <icon-rect-radius class="svg-node"/>
            </div>
            <div className="node-label">STEP</div>
        </div>

        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('SUB')">
                <icon-react-radius-sub class="svg-node"/>
            </div>
            <div className="node-label">SUB</div>
        </div>

        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('IFEL')">
                <icon-diamond class="svg-node" />
            </div>
            <div className="node-label">IFEL</div>
        </div>

        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('SWITCH')">
                <icon-heptagon class="svg-node" />
            </div>
            <div className="node-label">SWITCH</div>
        </div>

        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('FOR')">
                <icon-circle class="svg-node" />
            </div>
            <div className="node-label">FOR</div>
        </div>

        <div class="approve-node node-apply">
            <div class="node-shap" @mousedown="dragInNode('WHILE')">
                <icon-while class="svg-node" />
            </div>
            <div className="node-label">WHILE</div>
        </div>
    </div>
</template>
  

<style scoped>
.node-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    padding: 20px 10px;
    background-color: #fff;
    box-shadow: 0 0 10px 1px #e4e0db;
    border-radius: 6px;
    text-align: center;
    z-index: 101;
}
  
.approve-node {
    display: inline-block;
    margin-bottom: 20px;
}
.node-label {
    font-size: 12px;
    margin-top: 5px;
}

.svg-node {
    width: 32px;
    height: 30px;
}
</style>