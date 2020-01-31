import { Token, RPN } from './types';

const OperatorPriority = new Map<string, number>([
  ['^', 6],
  ['/', 5],
  ['*', 5],
  ['+', 4],
  ['-', 4],
  ['(', 0]
]);

export const parse = (tokens: Token[]) => {
  const queue = [];
  const stack = [];

  for (let token of tokens) {
    if (token === '(') {
      stack.push('(');
      continue;
    }

    if (token === ')') {
      while (stack[stack.length - 1] !== '(') {
        queue.push(stack.pop());
      }
      stack.pop();
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

  return queue as RPN;
}