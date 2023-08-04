<script setup>
import {onMounted} from 'vue'
import { approveNodes } from '../logic-flow/config'

const props = defineProps({
    obj: Object,
    test: Number
})

const dragNode = (item) => { 
    // console.log(props.obj)
    // console.log(item)

    props.obj.lf.dnd.startDrag({
        type: item.type,
        text: item.label,
    })
}

</script>

<template>
    <div class="node-panel">
        <div v-for="item in approveNodes" class="approve-node node-apply">
            <div
                className="node-shape"
                :style="item.style"
                @mousedown="dragNode(item)"
              ></div>
              <div className="node-label">{{ item.label }}</div>
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
</style>