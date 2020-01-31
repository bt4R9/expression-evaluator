import { Paren, Operator, Token } from './types';

export const isParen = (chunk: string): chunk is Paren => /^[()]$/.test(chunk);
export const isOperator = (chunk: string): chunk is Operator => /^[-+/*^]$/.test(chunk);
export const isNumber = (chunk: string) => /^[.0-9]+$/.test(chunk);
export const isSpace = (chunk: string) => /\s+/.test(chunk);

export const isValidSyntax = (tokens: Token[]) => {
  let parens = 0;
  let operators = 0;
  let operands = 0;
  let prev;

  for (const token of tokens) {
    if (token === '(') parens++;
    if (token === ')') parens--;
    if (isOperator(String(token))) operators++;
    if (typeof token === 'number') operands++;

    if (isOperator(String(token)) && isOperator(String(prev))) {
      return false;
    }

    prev = token;
  }

  if (parens !== 0) return false;
  if (operands - operators !== 1) return false;

  return true;
}