import { FNS } from './expression';

export type Operator = '+' | '-' | '*' | '/' | ':' | '^';
export type Paren = '(' | ')';
export type FN = keyof typeof FNS;
export type Token = number | Operator | Paren | FN;
export type RPN = Array<number | Operator | FN>
