import { FriendsAccept,usersSchema, FriendsMy,FriendsSchema, FriendsRequest,
} from '../schema/friends.schema.js';
import {friendsSearch,friendsAdd, confirmFriend, myFriends,requestFriend, declineFriend, notificationFriends,deleteFriend, sawAccept} from '../controllers/friends.js';
import { validatedValues } from "../utils/validate.js";


async function friendsRoutes(fastify) {
  fastify.post('/searchUsers', async (req, reply) => {
    const validated = usersSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return friendsSearch({ ...req, body: data }, reply);
  });
  fastify.post(`/addFriends`, async (req, reply) => {
    const validated = FriendsSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return friendsAdd({ ...req, body: data }, reply);
  });
  fastify.post(`/confirmFriend`, async (req, reply) => {
    const validated = FriendsAccept.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return confirmFriend({ ...req, body: data }, reply);
  });
  fastify.post(`/declineFriend`, async (req, reply) => {
    const validated = FriendsAccept.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return declineFriend({ ...req, body: data }, reply);
  });
  fastify.post(`/request`, async (req, reply) => {
    const validated = FriendsRequest.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return requestFriend({ ...req, body: data }, reply);
  });
  fastify.post(`/myfriends`, async (req, reply) => {
    const validated = FriendsMy.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return myFriends({ ...req, body: data }, reply);
  });
  fastify.post(`/notificationFriend`, async (req, reply) => {
    const validated = FriendsMy.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return notificationFriends({ ...req, body: data }, reply);
  });
  fastify.post(`/sawAccept`, async (req, reply) => {
    const validated = FriendsSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return sawAccept({ ...req, body: data }, reply);
  });
  
  fastify.delete(`/deletefriend`, async (req, reply) => {
    const validated = FriendsSchema.safeParse(req.body);
    const data =await validatedValues(validated, reply);
    return deleteFriend({ ...req, body: data }, reply);
  });
}

export default friendsRoutes;
