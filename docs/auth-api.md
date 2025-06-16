# 🛡️ Auth API Documentation

This API provides endpoints for user authentication and user management using **Fastify** and **Zod** for input validation.

🔐 **Authentication is handled using JWT (JSON Web Tokens).**

When a user logs in, a JWT access token is generated and returned. This token must be included in the `Authorization` header for accessing protected routes like `/users/me`.

---

## 📁 Endpoints

### 🔐 POST `/login`

Authenticate an existing user and receive a JWT access token.

#### Request Body

```json
{
  "email": "kuku@kuku.com",
  "password": "kuku"
}

```
### On Success 
***Status 200***
- if email and password are matching and correct user Logged in

### ON Fail
***Status 400:***
- if no matching password
- if no matching email
- No such as user(becuase email is not matchinhg)

***Status 500:***
- Error with database