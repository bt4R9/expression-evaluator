import { isParen, isNumber, isOperator, isSpace, isLetter, isFunction, isDevider, isFNPart } from './utils';
import { Token, FN } from './types';

export const tokenizr = (input: string) => {
  const tokens: Array<Token> = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (isLetter(char)) {
      const [fn, offset] = tokenizeFunction(input, i);
      if (!isFunction(String(fn))) {
        throw new Error(`Unknown function ${fn}`);
      }
      tokens.push(fn);
      i = offset - 1;
    } else if (isParen(char)) {
      tokens.push(char);
    } else if (char === '-' && isNumber(input[i + 1])) {
      const [number, offset] = tokenizeNumber(input, i + 1);
      tokens.push(-number);
      i = offset - 1;
    } else if (isNumber(char)) {
      const [number, offset] = tokenizeNumber(input, i);
      tokens.push(number);
      i = offset - 1;
    } else if (isOperator(char)) {
      tokens.push(char);
    } else if (isDevider(char)) {
      continue;
    } else if (isSpace(char)) {
      continue;
    } else {
      throw new Error(`Unexpected token ${char}`)
    }
  }
  console.log(tokens);
  return tokens;
}

const tokenizeNumber = (input: string, index: number) => {
  let buffer: string[] = [];
  while (isNumber(input[index])) buffer.push(input[index++])
  const number = Number(buffer.join(''));
  return [number, index];
}

const tokenizeFunction = (input: string, index: number): [FN, number] => {
  let buffer: string[] = [];
  while (isFNPart(input[index])) buffer.push(input[index++]);
  const fn = buffer.join('') as FN;
  return [fn, index];
}