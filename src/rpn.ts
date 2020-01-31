import { RPN } from './types';

export const rpn_exec = (rpn: RPN) => {
  let stack: number[] = [];

  for (let item of rpn) {
    if (typeof item !== 'number') {
      let r = stack.pop();
      let l = stack.pop();

      switch (item) {
        case '+': stack.push(l + r); break;
        case '-': stack.push(l - r); break;
        case '*': stack.push(l * r); break;
        case '/': stack.push(l / r); break;
        case '^': stack.push(l ** r); break;
      }
    } else {
      stack.push(item);
    }
  }

  return stack[0];
}