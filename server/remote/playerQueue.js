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

  /**
   * Dequeue the first waiting player whose user_id differs from the given one.
   * If no such player exists, returns undefined without modifying the queue.
   *
   * @param {number|undefined} userId - id of the connecting user
   * @returns {import('ws').WebSocket|undefined}
   */
  dequeueDifferent(userId) {
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (item.ws.user_id !== userId) {
        this.queue.splice(i, 1);
        return item.ws;
      }
    }
    return undefined;
  }

  remove(ws) {
    this.queue = this.queue.filter((p) => p.ws !== ws);
  }

  get size() {
    return this.queue.length;
  }
}
