import { RPN, Token, FN, Operator } from './types';
import { expression_exec, FNS } from './expression';
import { isFunction } from './utils';

const OperatorPriority = new Map<string, number>([
  ['^', 6],
  [':', 5],
  ['/', 5],
  ['*', 5],
  ['+', 4],
  ['-', 4],
  ['(', 0]
]);

export const rpn_build = (infix_tokens: Token[]) => {
  const queue = [];
  const stack = [];

  for (let token of infix_tokens) {
    if (isFunction(String(token))) {
      stack.push(token);
      continue;
    }

    if (token === '(') {
      stack.push('(');
      continue;
    }

    if (token === ')') {
      while (stack[stack.length - 1] !== '(') {
        queue.push(stack.pop());
      }

      stack.pop();

      if (isFunction(String(stack[stack.length - 1]))) {
        queue.push(stack.pop());
      }

      continue;
    }

    if (OperatorPriority.has(String(token))) {
      while (stack.length !== 0 && (
        OperatorPriority.get(String(token)) <= OperatorPriority.get(String(stack[stack.length - 1]))
      )) {
        queue.push(stack.pop());
      }
      stack.push(token);
      continue;
    }

    if (typeof token === 'number') {
      queue.push(token);
    }
  }

  while (stack.length !== 0) {
    queue.push(stack.pop());
  }
  console.log(queue);
  return queue as RPN;
}

export const rpn_exec = (rpn: RPN) => {
  let stack: number[] = [];

  for (let item of rpn) {
    if (isFunction(String(item))) {
      let [length, exec] = FNS[item as FN] as [number, Function];
      let args: number[] = [];
      while (length-- > 0) args.unshift(stack.pop());
      stack.push(exec(...args));
    } else if (typeof item !== 'number') {
      let r = stack.pop();
      let l = stack.pop();
      stack.push(expression_exec(item as Operator, l, r));
    } else {
      stack.push(item);
    }
  }

  return stack[0];
}