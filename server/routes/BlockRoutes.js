import { BlockSchema } from '../schema/block.schema.js';
import { block, unblock, getBlocked } from '../controllers/blocks.js';
import { validatedValues } from '../utils/validate.js';

async function blockRoutes(fastify) {
  fastify.post('/block', { preHandler: fastify.authenticate }, async (req, reply) => {
    const validated = BlockSchema.safeParse(req.body);
    const data = await validatedValues(validated, reply);
    return block({ ...req, body: data }, reply);
  });

  fastify.post('/unblock', { preHandler: fastify.authenticate }, async (req, reply) => {
    const validated = BlockSchema.safeParse(req.body);
    const data = await validatedValues(validated, reply);
    return unblock({ ...req, body: data }, reply);
  });

  fastify.get('/blocked', { preHandler: fastify.authenticate }, getBlocked);
}

export default blockRoutes;
