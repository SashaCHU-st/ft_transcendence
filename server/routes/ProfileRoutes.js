import { ProfileSchema } from "../schema/profile.schema.js";
import fastifyMultipart from "@fastify/multipart";
import { updateProfile, uploadPicture } from "../controllers/profile.js";
import { validatedValues } from "../utils/validate.js";
async function profileRoutes(fastify) {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, 
    },
  });

  fastify.patch(
    "/updateProfile",
    {
      preHandler: fastify.authenticate,
    },
    
    async (req, reply) => {
      const validated = ProfileSchema.safeParse(req.body);
      const data =await validatedValues(validated, reply);
      return updateProfile({ ...req, body: data }, reply);
    }
  );

  fastify.post(
    "/uploadPicture",
    {
      preHandler: fastify.authenticate,
      config: {
        multipart: true,
      },
    },async (req, reply) => {
      const data = await req.file();
      if (!data) {
        return reply.code(400).send({ message: "No picture uploaded" });
      }
      return uploadPicture(data, reply);
    }
  );
}

export default profileRoutes;
