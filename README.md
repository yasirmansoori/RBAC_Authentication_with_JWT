<h1 align="center">
  Advanced JWT RBAC Authentication
</h1>
<div align="center">
Welcome to the Advanced JWT RBAC Authentication ! This project offers essential features such as role-based user authentication, user and admin authentication using JSON Web Tokens (JWT). The database stores invalidated tokens and user information, enabling role-based authentication. Access token and refresh token are employed for user authentication, with the refresh token used to renew the access token. Admins have the ability to view, update, and delete users, while users can register, log in, refresh tokens, and log out. This project serves as an excellent foundation for any application requiring user authentication and role-based access control. Feel free to customize and share your insights. 🚀
</div>

## Tech Stack Used
![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
![express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 🔑 Key Features

### Role-Based User Authentication:
- Defined Roles:
  - Admin
  - User
- Role Assignment by Admin
- Authorization Middleware
- Seperate admin and user routes
- User and Admin authentication using JWT

## Deployment
- Deployed [Here](https://rbac-authentication-with-jwt.onrender.com/)

## 📦 Getting Started

- Clone the repository:
```sh
git clone https://github.com/yasirmansoori/RBAC_Authentication_with_JWT.git
```
- Install dependencies:
```sh
 npm install
```
- Start the development server:
```sh
  npm run dev
```

## 📝 Environment Variables

- Create a .env file in the root of the server directory and add the following environment variables:
```sh
MONGODB_URI = "Your MongoDB URI"
DATABASE_NAME = "Your Database Name"
SECRET_KEY = "Your Secret Key"
```
## Note:
You can generate your secret key by running the following command in your terminal:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

## 📚Postman Collection

- [Postman Collection](https://elements.getpostman.com/redirect?entityId=27998287-93df7c7f-4fe1-4281-8883-f039dfaa61ff&entityType=collection)

- Use the above Postman Collection to test the API endpoints, or import the collection.postman_collection.json file into Postman.

## 📚Schema Overview
-   ### User

    -   `_id` _(auto-generated-unique)_ 
    -   `name`
    -   `email` _(unique)_
    -   `username` 
    -   `password` _(encrypted)_
    -   `role` _(admin/user)_

-   ### Tokens

    -   `_id` _(auto-generated-unique)_ 
    -   `token`
    -   `user_id`
    -   `invalidated_at`

## **🚀API Router Endpoints** 

<h1>General Routes -</h1>
<table>
  <tr>
    <th colspan="4" style="text-align:center">General</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
    <td>Request Body</td>
  </tr>
  </tr>
  <tr>
    <td>/api/v1/</td>
    <td>GET</td>
    <td>server running status</td>
      <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/login</td>
    <td>POST</td>
    <td>Login a user</td>
    <td>
      <pre>
      {
        "email": "string"
        "password": "string"
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>/api/v1/register</td>
    <td>POST</td>
    <td>Register a user</td>
    <td>
      <pre>
      {
        "name": "string",
        "email": "string",
        "username": "string",
        "password": "string",
        "role": "string" 
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>/api/v1/refresh-token</td>
    <td>POST</td>
    <td>Refresh the JWT token</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/logout</td>
    <td>DELETE</td>
    <td>Logout the user</td>
    <td>None</td>
  </tr>
</table>

<h1>Admin Routes -</h1>
<table>
  <tr>
    <th colspan="5" style="text-align:center">Admin</th>
  </tr>
  <tr>
    <td>Endpoints</td>
    <td>Method</td>
    <td>Description</td>
    <td>Parameters</td>
    <td>Request Body</td>
  </tr>
  <tr>
    <td>/api/v1/admin/users</td>
    <td>GET</td>
    <td>Get all the users in the database.</td>
    <td>None</td>
    <td>None</td>
  </tr>
  <tr>
    <td>/api/v1/admin/users/:id</td>
    <td>GET</td>
    <td>Get a single user by id.</td>
    <td>id</td>
    <td>None</td>
  </tr>
    <tr>
    <td>/api/v1/admin/users/:id</td>
    <td>PUT</td>
    <td>Update a user by id.</td>
    <td>id</td>
    <td>
      <pre>
      {
        "name": "string",
        "email": "string",
        "username": "string",
        "password": "string",
        "role": "string" 
      }
      </pre>
  </tr>
  <tr>
    <td>/api/v1/admin/users/:id</td>
    <td>DELETE</td>
    <td>Delete a user by id.</td>
    <td>id</td>
    <td>None</td>
  </tr>
</table>

## **API Response Codes**
|                    | `200` | `201`   | `400`       | `401`        | `403`     | `404`     | `500`                 | `503`               |
| ------------------ | ----- | ------- | ----------- | ------------ | --------- | --------- | --------------------- | ------------------- |
| API Response Codes | OK    | Created | Bad Request | Unauthorized | Forbidden | Not Found | Internal Server Error | Service Unavailable |

## **API Response Structure**
|                    | `status`           | `message`                | `data`        | `error`                |
| ------------------ | ------------------ | ------------------------ | ------------- | ---------------------- |
| API Response Codes | HTTP Response Code | Response message Created | Response data | Error message (if any) |

<div align="center">Made with ❤️</div>