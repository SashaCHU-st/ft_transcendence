import test from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import alertRoutes from '../routes/AlertRoutes.js';

function createServer() {
  const fastify = Fastify({ logger: false });
  fastify.register(alertRoutes);
  return fastify;
}

test('POST /alert returns 200', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  t.after(() => fastify.close());

  const res = await fastify.inject({
    method: 'POST',
    url: '/alert',
    payload: { test: true },
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });
});
