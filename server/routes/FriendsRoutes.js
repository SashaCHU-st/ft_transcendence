import { FriendsAccept, FriendsAddSchema, FriendsSchema } from "../schema/friends.schema.js";
import { friendsSearch, friendsAdd, confirmFriend } from "../controllers/friends.js";
async function friendsRoutes(fastify) {
  fastify.post("/friends", async (req, reply) => {
    const validated = FriendsSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return friendsSearch({ ...req, body: validated.data }, reply);
  });

  fastify.post("/addFriends", async (req, reply) => {
    console.log("WE ARE IN ADD FRIENDS")
    const validated = FriendsAddSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    // const haha = req.body();
    // console.log("hahahah",haha)
    return friendsAdd({ ...req, body: validated.data }, reply);
  });
  fastify.post("/confirmFriend", async (req, reply) => {
    console.log("we in confirm friend")
    const validated = FriendsAccept.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    // const haha = req.body();
    // console.log("hahahah",haha)
    return confirmFriend({ ...req, body: validated.data }, reply);
  });
}

export default friendsRoutes;
