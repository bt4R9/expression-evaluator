export class Stack<T> {
  private array: T[] = [];

  push(item: T) {
    this.array.push(item);
  }

  pop() {
    return this.array.pop();
  }

  peek() {
    return this.array[this.array.length - 1];
  }

  empty() {
    return this.array.length === 0;
  }
}