import { ProfileSchema } from "../schema/profile.schema.js";
import fastifyMultipart from "@fastify/multipart";
import { updateProfile, uploadPicture } from "../controllers/profile.js";

async function profileRoutes(fastify) {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, //max (10MB)
    },
  });

  fastify.patch(
    "/updateProfile",
    {
      preHandler: fastify.authenticate,
    },
    async (req, reply) => {
      const validated = ProfileSchema.safeParse(req.body);
      if (!validated.success) {
        return reply.code(400).send({
        message:validated.error.errors[0].message ,
        });
      }
      return updateProfile({ ...req, body: validated.data }, reply);
    }
  );

  fastify.post(
    "/uploadPicture",
    {
      preHandler: fastify.authenticate,
      config: {
        multipart: true,
      },
    },
    async (req, reply) => {
      const data = await req.file();
      // const email = pic.fields?.email.value;
      // console.log("email:", email);
      if (!data) {
        return reply.code(400).send({ message: "No picture uploaded" });
      }

      // if (!email) {
      //   return reply.code(400).send({ message: "No email provided" });
      // }
      return uploadPicture(data, reply);
    }
  );
}

export default profileRoutes;
