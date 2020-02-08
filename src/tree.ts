import { RPN, Operator } from "./types";
import { expression_exec } from './expression';

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

export const tree_exec = (node: Node | null): number => {
  if (!node) return 0;
  if (typeof node === 'number') return node;

  return expression_exec(
    node.value as Operator,
    tree_exec(node.left),
    tree_exec(node.right)
  );
};