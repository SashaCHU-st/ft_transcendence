import { ProfileSchema } from "../schema/profile.schema.js";
import { updateProfile } from "../controllers/profile.js";

async function profileRoutes(fastify) {

    fastify.patch("/updateProfile", async (req, reply) =>
    {
        const validated = ProfileSchema.safeParse(req.body);
            if(!validated.success)
            {
              return reply.code(400).send({
                message: "Validation error",
                errors: validated.error.errors,
              });
            }
            return updateProfile ({...req, body:validated.data}, reply);
    })
    
}

export default profileRoutes;