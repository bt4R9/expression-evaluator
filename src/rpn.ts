import { RPN, Token, FN, Operator, Paren } from './types';
import { expression_exec, FNS } from './expression';
import { isFunction } from './utils';
import { Stack } from './stack';

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
  const stack = new Stack<Operator | Paren | FN>();

  for (const token of infix_tokens) {
    if (isFunction(String(token))) {
      stack.push(token as FN);
      continue;
    }

    if (token === '(') {
      stack.push(token);
      continue;
    }

    if (token === ')') {
      while (stack.peek() !== '(') {
        queue.push(stack.pop());
      }

      stack.pop();

      if (isFunction(String(stack.peek()))) {
        queue.push(stack.pop());
      }
    }

    if (OperatorPriority.has(String(token))) {
      while (!stack.empty() && OperatorPriority.get(String(token)) <= OperatorPriority.get(String(stack.peek()))) {
        queue.push(stack.pop());
      }

      stack.push(token as Operator);
      continue;
    }

    if (typeof token === 'number') {
      queue.push(token);
    }
  }

  while (!stack.empty()) {
    queue.push(stack.pop());
  }

  return queue as RPN;
}

export const rpn_exec = (rpn: RPN) => {
  const stack = new Stack<number>();

  for (let item of rpn) {
    if (isFunction(String(item))) {
      let [length, fn_exec] = FNS[item as FN] as [number, Function];
      let args: number[] = [];
      while (length-- > 0) args.unshift(stack.pop());
      stack.push(fn_exec(...args));
    } else if (typeof item !== 'number') {
      let r = stack.pop();
      let l = stack.pop();
      stack.push(expression_exec(item as Operator, l, r));
    } else {
      stack.push(item);
    }
  }

  return stack.pop();
}

export const rpc_intermediate_results = (rpn: RPN) => {
  const queue: number[] = [];
  const stack = new Stack<number>();

  for (let item of rpn) {
    if (isFunction(String(item))) {
      let [length, fn_exec] = FNS[item as FN] as [number, Function];
      let args: number[] = [];
      while (length-- > 0) args.unshift(stack.pop());
      const result = fn_exec(...args);
      queue.push(result);
      stack.push(result);
    } else if (typeof item !== 'number') {
      let r = stack.pop();
      let l = stack.pop();
      const result = expression_exec(item as Operator, l, r);
      queue.push(result);
      stack.push(result);
    } else {
      stack.push(item);
    }
  }

  return queue;
}