import fp from 'fastify-plugin';

async function alertRoutes(fastify) {
  fastify.post('/alert', async (req, reply) => {
    fastify.log.info({ alert: req.body }, 'Received alert');
    return { status: 'ok' };
  });
}

export default fp(alertRoutes);
