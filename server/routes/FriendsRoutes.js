import { FriendsAccept, usersSchema, FriendsMy, FriendsSchema} from "../schema/friends.schema.js";
import { friendsSearch, friendsAdd, confirmFriend, myFriends, deleteFriend } from "../controllers/friends.js";
async function friendsRoutes(fastify) {
  fastify.post("/seacrhUsers", async (req, reply) => {
    const validated = usersSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return friendsSearch({ ...req, body: validated.data }, reply);
  });

  fastify.post(`/addFriends`, async (req, reply) => {
    const validated = FriendsSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return friendsAdd({ ...req, body: validated.data }, reply);
  });
  fastify.post(`/confirmFriend`, async (req, reply) => {
    const validated = FriendsAccept.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return confirmFriend({ ...req, body: validated.data }, reply);
  });

  fastify.post(`/myfriends`, async (req, reply) => {
    console.log("we in my friends")
    const validated = FriendsMy.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return myFriends({ ...req, body: validated.data }, reply);
  });
  fastify.delete(`/deletefriend`, async (req, reply) => {
    console.log("we in my delete friends")
    const validated = FriendsSchema.safeParse(req.body);
    if (!validated.success) {
      return reply.code(400).send({
        message: "Validation error",
        errors: validated.error.errors,
      });
    }
    return deleteFriend({ ...req, body: validated.data }, reply);
  });
}

export default friendsRoutes;
