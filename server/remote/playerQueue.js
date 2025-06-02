export default class PlayerQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(ws) {
    this.queue.push({ ws });
  }

  dequeue() {
    const item = this.queue.shift();
    return item ? item.ws : undefined;
  }

  remove(ws) {
    this.queue = this.queue.filter((p) => p.ws !== ws);
  }

  get size() {
    return this.queue.length;
  }
}
