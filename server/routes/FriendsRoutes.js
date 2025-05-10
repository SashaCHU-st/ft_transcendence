import {FriendsAddSchema, FriendsSchema} from "../schema/friends.schema.js"
import { friendsSearch } from "../controllers/friends.js";
async function friendsRoutes(fastify) {

    fastify.post ("/friends", async (req, reply) =>
    {
        const validated = FriendsSchema.safeParse(req.body);
            if(!validated.success)
            {
              return reply.code(400).send({
                message: "Validation error",
                errors: validated.error.errors,
              });
            }
            return friendsSearch ({...req, body:validated.data}, reply);
    })
    
    fastify.post ("/add_friends", async (req, reply) =>
        {
            const validated = FriendsAddSchema.safeParse(req.body);
                if(!validated.success)
                {
                  return reply.code(400).send({
                    message: "Validation error",
                    errors: validated.error.errors,
                  });
                }
                return friendsAdd ({...req, body:validated.data}, reply);
        })
}

export default friendsRoutes;