interface Node {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number } | undefined;
  inPorts: any;
  outPorts: any;
  icon?: string | undefined;
  description?: string | undefined;
  componentName?: string | null | undefined;
  outputQ?: any[] | undefined;
}
interface Edge {
  id: string;
  selected: false;
  source: string;
  sourceHandle: null;
  target: string;
  targetHandle: null;
  type: string;
}
interface FileData {
  nodes: Record<Node["id"], Node>;
  edges: Record<Edge["id"], Edge>;
}
export function update(data: FileData): FileData {
  const ids = Object.keys(data.nodes);
  const otherUpdateTypes = [
    "buttonNode",
    "checkboxNode",
    "containsNode",
    "waitNode",
  ];

  for (const id of ids) {
    const node = data.nodes[id];
    if (node.type === "visitNode") {
      updateVisitNode(node);
    } else if (otherUpdateTypes.includes(node.type)) {
      updateOtherNode(node, node.type);
    } else if (node.type === "textInputType") {
      updateOtherNode(node, "textInputNode");
    }
  }

  return data;
}

function updateVisitNode(node: Node): Node {
  node.type = "anyNode";
  node.data.componentType = "visitNode";
  node.inPorts.field = node.inPorts.url;
  delete node.inPorts.url;
  return node;
}

function updateOtherNode(node: Node, compType: string): Node {
  node.type = "anyNode";
  node.data.componentType = compType;
  return node;
}
