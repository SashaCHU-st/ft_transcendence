# Chat API

This document describes the basic scenarios for working with the chat API.

## POST `/messages`
Send a direct message to another user. The request body must contain:

- `fromId` – the sender user id
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
