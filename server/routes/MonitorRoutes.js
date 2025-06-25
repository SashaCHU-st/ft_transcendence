import {
  getServerMetrics,
  updateCustomMetrics,
  getPromMetrics,
  promContentType,
} from '../utils/monitor.js';
import { getChatClientCount } from '../chatWsServer.js';
import { getActiveUserCount } from '../remote/wsServer.js';

async function metricsAuth(req, reply) {
  const token = process.env.METRICS_TOKEN;
  if (!token) return;
  const auth = req.headers.authorization || '';
  if (auth === `Bearer ${token}`) return;
  return reply.code(401).send({ message: 'Unauthorized' });
}

async function monitorRoutes(fastify) {
  fastify.get('/metrics', { preHandler: metricsAuth }, async (req, reply) => {
    const data = {
      ...(await getServerMetrics()),
      chatClients: getChatClientCount(),
      remotePlayers: getActiveUserCount(),
    };

    // update Prometheus gauges
    await updateCustomMetrics(data.chatClients, data.remotePlayers, data.dbFileSize);

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      const display = {
        Uptime: data.uptime.toFixed(0) + 's',
        'Memory RSS': (data.rss / 1024 / 1024).toFixed(1) + ' MB',
        'Heap Total': (data.heapTotal / 1024 / 1024).toFixed(1) + ' MB',
        'Heap Used': (data.heapUsed / 1024 / 1024).toFixed(1) + ' MB',
        External: (data.external / 1024 / 1024).toFixed(1) + ' MB',
        'Array Buffers': (data.arrayBuffers / 1024 / 1024).toFixed(1) + ' MB',
        'Load Avg': data.loadavg.map((n) => n.toFixed(2)).join(', '),
        'Chat Clients': data.chatClients,
        'Remote Players': data.remotePlayers,
      };
      return reply.view('metrics.ejs', { metrics: display });
    }

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return data;
    }

    const metricsText = await getPromMetrics();
    reply.header('Content-Type', promContentType);
    return metricsText;
  });

  fastify.get('/health', (req, reply) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return reply.view('health.ejs');
    }
    return { status: 'ok' };
  });
}

export default monitorRoutes;
