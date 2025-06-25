import test from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import monitorRoutes from '../routes/MonitorRoutes.js';

function createServer() {
  const fastify = Fastify({ logger: false });
  fastify.register(monitorRoutes);
  return fastify;
}

test('GET /health returns ok status JSON', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  t.after(() => fastify.close());

  const res = await fastify.inject({
    method: 'GET',
    url: '/health',
    headers: { Accept: 'application/json' },
  });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json(), { status: 'ok' });
});
