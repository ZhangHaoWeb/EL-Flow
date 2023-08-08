<script setup>
import { onMounted, ref, reactive } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
// import NodePanel from '../components/NodePanel.vue';
// import RegisteNode from '../logic-flow/registerNode';
import NodeSideBar from '../components/NodeSideBar.vue'
import {registerCustomElement} from '../logic-flow/index'
import nodeDataParse from '../logic-flow/nodeDataParse'

const container = ref(null)
const obj = reactive({})


onMounted(() => {
   const lf = new LogicFlow({
    container: container.value,
    grid: {
      size: 10,
      type: 'dot',
    },
    keyboard: { enabled: true }
  })

  obj.lf = lf
  obj.name = 'lee'


  registerCustomElement(lf)
  lf.render(

  );
})

const getAllData = () => {
  let data = obj.lf.getGraphData()
  const {expression, message} = nodeDataParse(data)
  console.log(expression)
}


</script>

<template>
  <!-- <NodePanel :obj="obj"/> -->
  <NodeSideBar :obj="obj"/>
  <div class="container" ref="container"></div>
  <button class="btn-data" @click="getAllData">获取数据</button>
</template>

<style scoped>
.container {
  height: 100%;
}

.btn-data {
  position: absolute;
  top: 30px;
  right: 50px;
}
</style>
