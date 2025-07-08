# Chat API

This document describes the basic scenarios for working with the chat API.

## POST `/messages`
Send a direct message to another user. The sender id is determined from the
authenticated JWT, so the body only needs:

- `toId` – the receiver user id
- `text` – message text

On success the server responds with HTTP `201` and returns the id of the stored message:

```json
{
  "id": 42
}
```

If any parameter is missing or the text is longer than 500 characters the server
returns `400` with a message describing the error.

## POST `/block`
Block another user. The authenticated user's id is taken from the JWT token,
so the request body only requires:

- `blockedId` – id of the user to block

If the block record is created a response with status `201` is returned.
When the users were already blocked the server responds with `200`.

## POST `/unblock`
Unblock a previously blocked user. Uses the same body as `/block`.
Returns `200` when the block existed and was removed, otherwise `404`.

If one user has blocked the other, messages are still accepted but only echoed
back to the sender. The receiver will not see them.

## GET `/blocked`
Retrieve the list of users that the authenticated account has blocked. The
request must include a valid JWT; the server uses it to determine the user
ID, so no query parameters are required.

The response contains an array of user ids:

```json
{
  "blocked": [1, 4, 7]
}
```

If the request succeeds the server returns `200`.

## GET `/messages`
Retrieve the chat history between two users. The query parameters are:

- `user1` – id of the first user
- `user2` – id of the second user

The response contains messages ordered by creation time:

```json
{
  "messages": [
    {
      "id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "text": "Hello",
      "created_at": "2024-05-06T12:00:00.000Z"
    }
  ]
}
```

## WebSocket chat
Real-time updates are delivered through a WebSocket connection. After authenticating
with JWT, clients connect to `/chat` supplying the `user_id` and `token` query
parameters. Whenever a new message is stored it is broadcast to both sender and
receiver as JSON:

```json
{
  "type": "chat",
  "message": { /* the same shape as above */ }
}
```

Clients should listen for these events to update the chat window without polling.

### System notifications
Apart from user messages the WebSocket delivers short-lived notifications using
the `system` message type. A notification payload looks like this:

```json
{
  "type": "system",
  "message": {
    "id": "abc123",
    "type": "info",
    "text": "Waiting for an opponent"
  }
}
```

Each notification includes an `id`, a `type` describing its category and a
`text` field. Notifications automatically expire after
`SYSTEM_MESSAGE_TTL_MS` milliseconds (60 seconds). When a notification is
cleared — either because it expired or was removed by the server — clients
receive a second event instructing them to delete it:

```json
{
  "type": "system_remove",
  "id": "abc123"
}
```

