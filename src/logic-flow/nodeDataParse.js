/**
 * Logic flow node datas parse to Lite flow El expression.
 * tree & graph DFS traverse.
 */

const SINGLE = "SINGLE"
const MULT = "MULT"
const IFEL = "IFEL"
const SWITCH = "SWITCH"
const FOR = "FOR"
const WHILE = "WHILE"
const STEP = "STEP"
const SUB = "SUB"

const ERROR_MAP = {
   NODE_EMPTY_VALUE: "节点缺少值",
   NODE_EMPTY_CHILDREN: "至少含有一个子节点",
   NODE_CHILD_MUST_SUB: "其子节点必须是SUB类型",
   NODE_INTERSECTION: "其相交节点不能是SUB节点",
   NODE_OUT_OVER_FLOW: "逻辑节点的出节点只能有一个"
}

/**
 * Default export function, create expression by logic flow data.
 * 
 * @param {object} data 
 */
export default function(data) {
    console.log(data)
    const nodes = JSON.parse(JSON.stringify(data.nodes))
    const edges = JSON.parse(JSON.stringify(data.edges))

    try {
        // validate node value.
        validateNodes(nodes)
        // create total tree by nodes and edges
        const treeHeadNode = parseNodesChildren(nodes[0], nodes, edges)
        console.log(treeHeadNode)
        // parse total tree to EL expression
        const expression = parseNodesTree(treeHeadNode, true, '') || ''
        return {
            expression,
            message: 'success'
        }
    } catch (e) {
        console.error(`${e.name}: ${e.message}`);
        return {
            expression: false,
            message: e.message
        }
    }
}


/**
 * Validate nodes's value.
 * @param {array} nodes 
 */
function validateNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node.text || !node.text.value) {
            throwErrorHandler(node, ERROR_MAP.NODE_EMPTY_VALUE)
        }
    }
}


/**
 * Foramt nodes & edges to total tree, return total tree's head node.
 * 
 * @param {object} node
 * @param {object} nodes
 * @param {object} edges 
 * @returns 
 */
function parseNodesChildren(node, nodes, edges) {
    if (!node) return false

    const id = node.id;
    let children = [];
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (id === edge.sourceNodeId) {
            let childId = edge.targetNodeId
            if (node.type == IFEL) parseNodeIFEL(node, edge)
            
            for (let j = 0; j < nodes.length; j++) {
                const node = nodes[j];
                if (node.id === childId) {
                    children.push(node)
                    // 递归
                    parseNodesChildren(node, nodes, edges)
                }
            }
        }
    }   
    
    node.children = [...children]
    return node
}


/**
 * IFEL node add ture or false property.
 * 
 * @param {object} node 
 * @param {object} edge 
 */
function parseNodeIFEL(node, edge) {
    if (edge.text && edge.text.value == "true") {
        node.properties.T = edge.targetNodeId
    }
    
    if (edge.text && edge.text.value == "false") {
        node.properties.F =  edge.targetNodeId
    }
}


/**
 * Parse nodes tree to EL expression.
 * 
 * @param {object} node 
 * @param {object} parentType 
 * @param {string} expression 
 * @returns 
 */
function parseNodesTree(node, isCreate, expression) {
    if (!node) {
        return expression
    }
    const children = node.children
    const nodeValue = node.text.value;
    const nodeType = node.type
    const isLogicNode =( nodeType == STEP || nodeType == SUB) ? false : true // if switch for while is logic node
    const nodeNumType = getNodeNumType(node)
    const interSectionNode = findInterSectionNode(node) 

    if (isLogicNode) {
        console.log("interSectionNode", interSectionNode)
        if (children.length == 0) {
            throwErrorHandler(node, ERROR_MAP.NODE_EMPTY_CHILDREN)
        }

        // if don't have interSectionNode, get out node, must be one out node.
        if (!interSectionNode) {
            var outNode = getLogicOutNode(node)
        } 

        if (!isCreate) {
            expression += `, `
        }

        // IFEL
        if (nodeType == IFEL) {
            if (isCreate && (interSectionNode || outNode)) {
                expression += `THEN(`
            }
            expression += `IF(${nodeValue}, `
            const arrChildEl = getMultSubExpressionList(children)
            if (arrChildEl.length > 1) {
                expression += `${arrChildEl[0]}).ELSE(${arrChildEl[1]})`
            } else {
                expression += `${arrChildEl[0]})`
            }

            // has intersection node
            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
            }

            // has out node
            if (outNode) {
                expression += parseNodesTree(outNode, false, '')
            }

            // close create
            if ((interSectionNode || outNode) && isCreate) {
                expression += ')'
            }
        }

        // SWITCH
        if (nodeType == SWITCH) {
            if (isCreate && (interSectionNode || outNode)) {
                expression += `THEN(`
            }
            expression += `SWITCH(${nodeValue}).TO(`
            const arrChildEl = getMultSubExpressionList(children)
            expression += arrChildEl.join(',') + ')'

            // has intersection node
            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
            }

            // has out node
            if (outNode) {
                expression += parseNodesTree(outNode, false, '')
            }

            // close create
            if ((interSectionNode || outNode) && isCreate) {
                expression += ')'
            }
        }

        // FOR & WHILE
        if (nodeType == FOR || (nodeType == WHILE)) {
            const outNode = findLoopOutNode(node)
            if (isCreate && outNode) {
                expression += 'THEN('
            }

            if (nodeType == FOR) {
                expression += `FOR(${nodeValue}).DO(`
            } else {
                expression += `WHILE(${nodeValue}).DO(`
            }
            const arrChildEl = getMultSubExpressionList(children)
            if (arrChildEl.length > 1) {
                expression += `WHEN(${arrChildEl.join(',')}))`
            } else {
                expression += arrChildEl.join(',') + ')'
            }
            
            if (outNode) {
                expression += parseNodesTree(outNode, false, '')
                if (isCreate) {
                    expression += ')'
                }
            }
        }
    } else {
        if (isCreate) {
            expression += `THEN(${nodeValue}`
        } else {
            expression += `, ${nodeValue}`
        }

        if (nodeNumType == SINGLE) {
            expression += parseNodesTree(children[0], false, '')
        } else {
            expression += `, WHEN(`
            const arrChildEl = getMultSubExpressionList(children)
            expression += arrChildEl.join(',') + ')'

            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
            }
        }

        // close current expression
        if (isCreate && !node.properties.isSub) {
            expression += ')'
        }
    }
    return expression
}

/**
 * Create every child's expression.
 * 
 * @param {array} children 
 * @returns 
 */
function getMultSubExpressionList(children) {
    let arrChildEl = []
    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.children.length > 0) {
            // create new sub el
            let subExpression = parseNodesTree(child, true, '')
            arrChildEl.push(subExpression)
        } else {
            arrChildEl.push(child.text.value)
        }
    }
    return arrChildEl   
}


/**
 * Get the intersectant node.
 * 
 * @param {node} node 
 * @returns 
 */
function findInterSectionNode(node) {
    const children = node.children
    const paths = []
    const nodeMap = new Map()

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.type == STEP && node.type != STEP && node.type != SUB) {
            throwErrorHandler(node, ERROR_MAP.NODE_CHILD_MUST_SUB)
        }
        
        const set = new Set()
        const treeSet =  traverseTree(child, set, nodeMap)
        paths.push(treeSet)
    }

    const id = findPathsIntersection(paths)
    const intersectionNode = nodeMap.get(id)
   
    // tag intersection node
    if (intersectionNode) {
        intersectionNode.properties.isInterSection = true
        intersectionNode.properties.interSectionParent = node.id

        // spilt tree
        splitTreeTraverse(node, intersectionNode)
    }

    // IFEL & SIWTCH node intersection node can not be SUB type.
    if ((node.type == IFEL || node.type == SWITCH) && intersectionNode && intersectionNode.type == SUB) {
        throwErrorHandler(node, ERROR_MAP.NODE_INTERSECTION)
    }

    return intersectionNode
}

/** 
 * DFS traverse intersection node
 * 
 * @param {object} node 
 * @param {*} set 
 * @returns 
 */
function traverseTree(node, set, nodeMap) {
    set.add(node.id)
    nodeMap.set(node.id, node)
    if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            traverseTree(child, set, nodeMap)
        }
    }
    return set
}

/**
 * split tree by intersectionNode
 * 
 * @param {object} node 
 * @param {object} intersectionNode 
 * @returns 
 */
function splitTreeTraverse(node, intersectionNode) {
    if (!node) {
        return
    }

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.id == intersectionNode.id) {
            // set empty children
            node.children = []
        } else {
            // dfs
            splitTreeTraverse(child, intersectionNode)
        }
    }
}

function getLogicOutNode(node) {
    const outSet = new Set()
    travserseOutNode(node, outSet)
    if (outSet.size == 0) {
        return false
    }

    // out node muse be on. over flow.
    if (outSet.size > 1) {
        throwErrorHandler(node, ERROR_MAP.NODE_OUT_OVER_FLOW)
    }

    return Array.from(outSet)[0]
}

function travserseOutNode(node, outSet) {
    const children = node.children
    if (node.type == STEP) {
        outSet.add(node)
    } else {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            travserseOutNode(child, outSet)

            // clear sub node's children
            const outNodeList = Array.from(outSet)
            for (let j = 0; j < outNodeList.length; j++) {
                const outNode = outNodeList[j];
                if (outNode && child.id == outNode.id) {
                    node.children = []
                }
            }
        }
    }
}
/**
 * Get the out node of loop. 
 * 
 * @param {object} node 
 * @returns 
 */
function findLoopOutNode(node) {
    validateLoopSubNode(node)

    const outSet = new Set()
    travserseLoop(node, outSet)
    if (outSet.size == 0) {
        return false
    }
    const outNode = Array.from(outSet)[0]
    return outNode
}

/**
 * validate loop node.
 * 
 * @param {object} node 
 */
function validateLoopSubNode(node) {
    const children = node.children
 
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type == STEP) {
            throwErrorHandler(node, ERROR_MAP.NODE_CHILD_MUST_SUB)
        }
    }
}

/**
 * Loop node traverse.
 * 
 * @param {object} node 
 * @param {object} outSet 
 */
function travserseLoop(node, outSet) {
    const children = node.children

    if (node.type == STEP) {
        outSet.add(node)
    }

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        travserseLoop(child, outSet)
        const outNode = Array.from(outSet)[0]
        if (outNode && child.id == outNode.id) {
            node.children = []
        }
    }
}


/**
 * Get paths intersectant node.
 * 
 * @param {Array} paths 
 * @returns 
 */
function findPathsIntersection(paths) {
    const idSet = new Set()
    for (let i = 0; i < paths.length; i++) {
        let setItem = paths[i]
        for (const id of setItem.values()) {
            if (idSet.has(id)) {
                return id
            } else {
                idSet.add(id)
            }
        }
    }
}

/**
 * Get different node type.
 * 
 * @param {object} node 
 * @returns 
 */
function getNodeNumType(node) {
    if (!node) {
        return false
    }

    if (node.children.length > 1) {
        return MULT
    } else {
        return SINGLE
    }
}

/**
 * trow error handler.
 * 
 * @param {object} node 
 * @param {string} message 
 */
function throwErrorHandler(node, message) {
    if (node.text && node.text.value) {
        throw new Error(`[NODE:${node.text.value}] ${node.type} ${message}`)
    } else {
        throw new Error(`[NODE] ${node.type} ${message}`)
    }
}


