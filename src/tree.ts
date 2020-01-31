import { RPN } from "./types";

export class Node {
  constructor(
    public readonly value: number | string | Node,
    public readonly left: null | Node,
    public readonly right: null | Node
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

export const tree_build = (rpn: RPN) => {
  let stack: any[] = [];

  for (let t of rpn) {
    if (typeof t === "number") {
      stack.push(t);
    } else {
      let r = stack.pop();
      let l = stack.pop();

      stack.push(new Node(t, l, r));
    }
  }

  return stack[0] as Node;
};

export const tree_exec = (root: Node) => {
  function traverse(node: Node | number | null): number {
    if (!node) {
      return 0;
    }

    if (typeof node === "number") {
      return node;
    }

    switch (node.value) {
      case "+":
        return traverse(node.left) + traverse(node.right);
      case "-":
        return traverse(node.left) - traverse(node.right);
      case "*":
        return traverse(node.left) * traverse(node.right);
      case "/":
        return traverse(node.left) / traverse(node.right);
      case "^":
        return traverse(node.left) ** traverse(node.right);
      default:
        return 0;
    }
  }

  return traverse(root);
};
