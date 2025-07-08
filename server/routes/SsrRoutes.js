async function ssrRoutes(fastify) {
  fastify.get('/ssr', async (req, reply) => {
    return reply.view('index.ejs', {
      title: 'Super Pong',
      content: 'Server rendered content'
    });
  });
}

export default ssrRoutes;
