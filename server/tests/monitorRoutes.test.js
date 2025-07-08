import test from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import monitorRoutes from '../routes/MonitorRoutes.js';
import { promContentType } from '../utils/monitor.js';

function createServer() {
  const fastify = Fastify({ logger: false });
  fastify.register(monitorRoutes);
  return fastify;
}

test('GET /metrics with application/json returns metrics JSON', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  t.after(() => fastify.close());

  const res = await fastify.inject({
    method: 'GET',
    url: '/metrics',
    headers: { Accept: 'application/json' },
  });

  assert.equal(res.statusCode, 200);
  const data = res.json();
  assert.ok(Object.prototype.hasOwnProperty.call(data, 'rss'));
  assert.ok(Object.prototype.hasOwnProperty.call(data, 'dbFileSize'));
  assert.ok(Object.prototype.hasOwnProperty.call(data, 'chatClients'));
});

test('GET /metrics defaults to Prometheus text', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  t.after(() => fastify.close());

  const res = await fastify.inject('/metrics');

  assert.equal(res.statusCode, 200);
  assert.ok(res.payload.startsWith('# HELP'));
});

test('GET /metrics sets Prometheus content type', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  t.after(() => fastify.close());

  const res = await fastify.inject('/metrics');

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-type'], promContentType);
});

test('metrics route requires token when METRICS_TOKEN set', async (t) => {
  process.env.METRICS_TOKEN = 'secret';
  const fastify = createServer();
  await fastify.ready();
  t.after(() => {
    delete process.env.METRICS_TOKEN;
    return fastify.close();
  });

  const resUnauthorized = await fastify.inject('/metrics');
  assert.equal(resUnauthorized.statusCode, 401);

  const resAuthorized = await fastify.inject({
    method: 'GET',
    url: '/metrics',
    headers: { Authorization: 'Bearer secret' },
  });
  assert.equal(resAuthorized.statusCode, 200);
});

test('GET /metrics does not log error when database missing', async (t) => {
  const fastify = createServer();
  await fastify.ready();
  let logged = false;
  const orig = console.error;
  console.error = () => { logged = true; };
  t.after(() => {
    console.error = orig;
    return fastify.close();
  });

  const res = await fastify.inject('/metrics');
  assert.equal(res.statusCode, 200);
  assert.equal(logged, false);
});
