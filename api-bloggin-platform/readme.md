# Blogging Platform API
- Postman Documentation : [Doc](https://documenter.getpostman.com/view/27311000/2sAY4rDQJG)
- idea from [RoadMap.sh](https://roadmap.sh/projects/blogging-platform-api)

This project is a **Blogging Platform API** built with the following stack:

- **Cloudflare Worker**: Serverless runtime for API deployment
- **TypeScript**: Type-safe language for writing scalable JavaScript
- **Prisma ORM**: Database ORM for managing models and queries
- **Hono**: Small, fast web framework to handle HTTP requests
- **Zod**: Validation library for request body schema validation

## Features

- **User Management**: Create, update, and manage users.
- **Authentication**: Secure login and cookie-based authentication.
- **Blog Posts**: Create, update, delete, and fetch blog posts.
- **Validation**: Strong input validation with Zod to ensure valid data.

## Project Structure

- `app.js`: Main entry point of the application that defines routes for users, authentication, and posts.
- `/routes`: Contains the route handlers for users, authentication, and blog posts.
- `/services`: Business logic for handling user and post operations.
- `/middleware`: Custom middleware for authentication handling.
- `/types/dto.ts`: TypeScript definitions for data transfer objects (DTOs).

## API Endpoints

### Users
- **GET /users**: Fetch all users
- **GET /users/:id**: Fetch a user by ID
- **POST /users**: Create a new user
- **PUT /users/:id**: Update user information (requires authentication)

### Authentication
- **POST /auth/login**: Log in a user and set a signed cookie for authentication
- **POST /auth/logout**: Log out a user and remove authentication cookie
- **GET /auth/protected**: Access a protected route (requires login)
- **GET /auth/debug-cookie**: Debug the authentication cookie

### Posts
- **GET /posts**: Fetch all blog posts
- **GET /posts/:id**: Fetch a blog post by ID
- **POST /posts**: Create a new blog post (requires authentication)
- **PUT /posts/:id**: Update an existing blog post (requires authentication and authorization)
- **DELETE /posts/:id**: Delete a blog post (requires authentication and authorization)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/blogging-platform-api.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - `.env` for database and secret configurations.

4. Deploy with Cloudflare:

   ```bash
   wrangler publish
   ```

## Technologies Used

- **Cloudflare Worker**: Serverless platform for API hosting.
- **Prisma ORM**: Manages database schema and queries.
- **TypeScript**: Type-safe JavaScript for better maintainability.
- **Hono**: Lightweight framework for building APIs.
- **Zod**: Ensures request data is properly validated.

## License

MIT License