export type Operator = '+' | '-' | '*' | '/' | '^';
export type Paren = '(' | ')';
export type Token = number | Operator | Paren;
export type RPN = Array<number | Operator>
