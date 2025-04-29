import { ProfileSchema } from "../schema/profile.schema.js";
import fastifyMultipart from "@fastify/multipart";
import { updateProfile, uploadPicture } from "../controllers/profile.js";

async function profileRoutes(fastify) {
  fastify.register(fastifyMultipart);

  fastify.patch("/updateProfile", async (req, reply) => {
    const validated = ProfileSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return updateProfile({ ...req, body: validated.data }, reply);
  });
  fastify.post("/uploadPicture", async (req, reply) => {
    const pic = await req.file();
    // const email = pic.fields?.email.value;
    // console.log("email:", email);

    if (!pic) {
      return reply.code(400).send({ message: "No picture uploaded" });
    }

    // if (!email) {
    //   return reply.code(400).send({ message: "No email provided" });
    // }

    return uploadPicture(pic, reply);
  });
}

export default profileRoutes;
