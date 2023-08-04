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
    {
    "nodes": [
        {
            "id": "a416656c-463b-4a71-af43-4102d0f832c2",
            "type": "FOR",
            "x": 360,
            "y": 270,
            "properties": {},
            "text": {
                "x": 360,
                "y": 270,
                "value": "5"
            }
        },
        {
            "id": "9d5d34a6-ef72-4960-8c4e-f27d2706f850",
            "type": "SUB",
            "x": 500,
            "y": 270,
            "properties": {},
            "text": {
                "x": 500,
                "y": 270,
                "value": "a"
            }
        },
        {
            "id": "0f3ce718-192c-43a2-8308-545aafcbe5d0",
            "type": "SUB",
            "x": 670,
            "y": 270,
            "properties": {},
            "text": {
                "x": 670,
                "y": 270,
                "value": "c"
            }
        },
        {
            "id": "0bd59276-3370-4787-848f-9c803bbbb9d1",
            "type": "STEP",
            "x": 830,
            "y": 270,
            "properties": {},
            "text": {
                "x": 830,
                "y": 270,
                "value": "d"
            }
        }
    ],
    "edges": [
        {
            "id": "1b53a1e9-2962-4331-8c45-8e4b8217fdd0",
            "type": "polyline",
            "sourceNodeId": "a416656c-463b-4a71-af43-4102d0f832c2",
            "targetNodeId": "9d5d34a6-ef72-4960-8c4e-f27d2706f850",
            "startPoint": {
                "x": 395,
                "y": 270
            },
            "endPoint": {
                "x": 450,
                "y": 270
            },
            "properties": {},
            "pointsList": [
                {
                    "x": 395,
                    "y": 270
                },
                {
                    "x": 425,
                    "y": 270
                },
                {
                    "x": 425,
                    "y": 270
                },
                {
                    "x": 420,
                    "y": 270
                },
                {
                    "x": 420,
                    "y": 270
                },
                {
                    "x": 450,
                    "y": 270
                }
            ]
        },
        {
            "id": "1c14cc78-921a-472e-93b5-94bfa7a3d8cf",
            "type": "polyline",
            "sourceNodeId": "9d5d34a6-ef72-4960-8c4e-f27d2706f850",
            "targetNodeId": "0f3ce718-192c-43a2-8308-545aafcbe5d0",
            "startPoint": {
                "x": 550,
                "y": 270
            },
            "endPoint": {
                "x": 620,
                "y": 270
            },
            "properties": {},
            "pointsList": [
                {
                    "x": 550,
                    "y": 270
                },
                {
                    "x": 620,
                    "y": 270
                }
            ]
        },
        {
            "id": "d7471b92-fa1b-4e2b-a88b-411c575361c4",
            "type": "polyline",
            "sourceNodeId": "0f3ce718-192c-43a2-8308-545aafcbe5d0",
            "targetNodeId": "0bd59276-3370-4787-848f-9c803bbbb9d1",
            "startPoint": {
                "x": 720,
                "y": 270
            },
            "endPoint": {
                "x": 780,
                "y": 270
            },
            "properties": {},
            "pointsList": [
                {
                    "x": 720,
                    "y": 270
                },
                {
                    "x": 780,
                    "y": 270
                }
            ]
        }
    ]
}
  );
})

const getAllData = () => {
  let data = obj.lf.getGraphData()

  try {
    const el = nodeDataParse(data)
    console.log(`%c[result]: ${el}`, 'color: orange')

  } catch (e) {
    console.error(`${e.name}: ${e.message}`);
  }
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
