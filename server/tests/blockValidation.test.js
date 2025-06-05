import test from 'node:test';
import assert from 'node:assert/strict';
import { BlockSchema } from '../schema/block.schema.js';
import { validatedValues } from '../utils/validate.js';

function createReply() {
  return {
    status: null,
    body: null,
    code(code) { this.status = code; return this; },
    send(payload) { this.body = payload; return this; }
  };
}

test('BlockSchema rejects negative blockedId', async () => {
  const reply = createReply();
  const validated = BlockSchema.safeParse({ blockedId: -1 });
  await assert.rejects(() => validatedValues(validated, reply));
  assert.equal(reply.status, 400);
});
