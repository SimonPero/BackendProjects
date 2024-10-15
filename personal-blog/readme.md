# Personal Blog Application

A simple blog platform where users can view articles, add comments, upvote/downvote comments, and manage articles (create, edit, delete) through an admin interface.

## Features

- **Article Management**: Admin can add, edit, and delete blog articles.
- **Article Display**: Visitors can view articles, including their content, publication date, and liking metrics (likes and dislikes).
- **Comments**: Users can comment on articles, upvote/downvote comments, and view existing comments.
- **Authentication**: Secure admin section with authentication middleware.
- **Liking System**: Articles have like/dislike buttons, and comments have upvote/downvote functionality.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS
- **Storage**: File-based storage for articles and comments using JSON files
- **Authentication**: Custom middleware for route protection

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-blog.git
   cd personal-blog
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:8080`.

## File Structure

```
.
├── public/
│   ├── style.css           # Basic styling for the web pages
│   ├── index.js            # Frontend JavaScript handling interactions
│   └── votesLiking.js      # Script for comment voting and article liking
├── services/
│   ├── FileManager.service.js  # Handles file reading and writing operations
│   ├── Article.service.js      # Contains logic for managing articles
│   └── Comment.service.js      # Contains logic for managing comments
├── middleware.js            # Custom middleware for admin authentication
├── app.js                   # Main application file (server)
└── README.md                # Project documentation (this file)
```

## API Routes

### Public Routes

- **`GET /home`**: Home page that lists all articles.
- **`GET /article/:id`**: Display a specific article by `id`, along with its comments and liking system.
- **`POST /addComment/:id`**: Add a comment to a specific article by `id`.
- **`PUT /article/liking`**: Update liking (like/dislike) on an article.
- **`PUT /comment/vote/:id`**: Upvote or downvote a specific comment by `id`.

### Admin Routes (Protected by Middleware)

- **`GET /admin`**: Admin panel listing all articles with options to edit or delete.
- **`GET /new`**: Form to create a new article.
- **`POST /new`**: Save a new article.
- **`GET /edit/:id`**: Edit a specific article by `id`.
- **`POST /edit/:id`**: Save changes to an article.
- **`DELETE /delete/:id`**: Delete a specific article by `id`.

## Usage

1. **Viewing Articles**:
   - Visit the homepage (`/home`) to see a list of all articles. Click on a title to read an article and its comments.
   - The article page displays like/dislike buttons and comments.
2. **Adding Comments**:
   - Users can add comments to any article from the article page.
3. **Admin Actions**:

   - Admins can add, edit, and delete articles. These actions are restricted via an authentication middleware (`authMiddleware`).

4. **Liking and Voting**:
   - Articles can be liked or disliked.
   - Comments can be upvoted or downvoted.

## Admin Authentication

To access admin-specific routes, ensure that the `authMiddleware` is properly configured in `middleware.js`. Adjust the authentication logic as needed for your application’s security requirements.

## Example Screenshots

### Homepage

![Home Page Screenshot](./screenshots/homepage.png)

### Article Page

![Article Page Screenshot](./screenshots/article-page.png)

## License

This project is open source and available under the [MIT License](LICENSE).
