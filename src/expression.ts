import { Operator } from './types';

export const FNS = {
  sin: [1, Math.sin],
  cos: [1, Math.cos],
  abs: [1, Math.abs],
  round: [1, Math.round],
  sqrt: [1, Math.sqrt],
  log: [1, Math.log],
  pow: [2, Math.pow],
  sum3: [3, (...args: number[]) => args.reduce((r, v) => r + v, 0)],
  sum4: [4, (...args: number[]) => args.reduce((r, v) => r + v, 0)],
  fib: [1, (n: number) => {
    let f = 0;
    let s = 1;

    if (n <= 1) return n;

    for (let i = 2; i <= n; i++) {
      let t = f + s;
      f = s;
      s = t;
    }

    return s;
  }],
  fac: [1, (n: number) => {
    if (n === 0) return 1;
    let sign = n > 0 ? 1 : - 1;

    let r = 1;

    for (let i = 2; i <= Math.abs(n); i++) {
      r *= i;
    }

    return r * sign;
  }]
};

export const expression_exec = (operator: Operator, left: number, right: number) => {
  switch (operator) {
    case '+': return left + right; break;
    case '-': return left - right; break;
    case '*': return left * right; break;
    case '/':
    case ':':
      return left / right; break;
    case '^': return left ** right; break;
    default:
      throw new Error(`Unknown operator ${operator}, l=${left}, r=${right}`);
  }
}