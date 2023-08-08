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


/**
 * Default export function, create expression by logic flow data.
 * 
 * @param {object} data 
 */
export default function(data) {
    console.log(data)
    const nodes = JSON.parse(JSON.stringify(data.nodes))
    const edges = JSON.parse(JSON.stringify(data.edges))

    // validate node value.
    validateNodes(nodes)

    // get total tree by nodes and edges
    const treeHeadNode = parseNodesChildren(nodes[0], nodes, edges)
    console.log(treeHeadNode)

    // parse tree to expression
    return parseNodesTree(treeHeadNode, true, '') || ''
}


/**
 * Validate nodes's value.
 * @param {array} nodes 
 */
function validateNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node.text || !node.text.value) {
            throw new Error(`[${node.type} node] ${node.id} does not have value, please check.`)
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
        console.log(`%c${nodeValue}  ${nodeType}`, 'color:red')
        if (children.length == 0) {
            throw new Error(`[${node.type} node] ${node.id} must has child node, please check.`)
        }

        if (!isCreate) {
            expression += `, `
        }

        // IFEL
        if (nodeType == IFEL) {
            if (isCreate && interSectionNode) {
                expression += `THEN(`
            }
            expression += `IF(${nodeValue}, `
            const arrChildEl = getMultSubExpressionList(children)
            if (arrChildEl.length > 1) {
                expression += `${arrChildEl[0]}).ELSE(${arrChildEl[1]})`
            } else {
                expression += `${arrChildEl[0]})`
            }
            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
                if (isCreate) {
                    expression += ')'
                }
            }
        }

        // SWITCH
        if (nodeType == SWITCH) {
            if (isCreate && interSectionNode) {
                expression += `THEN(`
            }
            expression += `SWITCH(${nodeValue}).TO(`
            const arrChildEl = getMultSubExpressionList(children)
            expression += arrChildEl.join(',') + ')'
            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
                if (isCreate) {
                    expression += ')'
                }
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
            console.log('FOR & WHILE:', arrChildEl)
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
        console.log(`%c${nodeValue}  ${nodeType}`, 'color:red')
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
            console.log(arrChildEl)

            if (interSectionNode) {
                expression += parseNodesTree(interSectionNode, false, '')
            }
        }

        // close current expression
        if (isCreate) {
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
        const node = children[i];
        const set = new Set()
        const treeSet =  traverseTree(node, set, nodeMap)
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
    if (children.length == 0) {
        throw new Error(`[${node.type} node]: ${node.id} must has sub node.`)
    }

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type == STEP) {
            throw new Error(`[${node.type} node]: ${node.id} sub node's type can not be STEP.`)
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

