import fp from 'fastify-plugin';

export default fp(async function urlData(fastify) {
  fastify.decorateRequest('urlData', function () {
    const rawUrl = this.raw.url || '';
    const path = rawUrl.split('?')[0];
    return { path };
  });
});
