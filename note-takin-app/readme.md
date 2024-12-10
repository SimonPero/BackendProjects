# Markdown Note-Taking App

A feature-rich, Markdown-based note-taking application built with modern technologies. This app enables users to create, manage, and organize notes with an intuitive interface, secure authentication, and advanced grammar checking capabilities.

- **Idea From**: [RoadMap.sh](https://roadmap.sh/projects/markdown-note-taking-app)
- [Visit App](https://backend-projects-2aoir323m-simonperos-projects.vercel.app)
---

## 🌟 **Project Overview**

### **Purpose**

The **Markdown Note-Taking App** is inspired by [RoadMap.sh](https://roadmap.sh/projects/markdown-note-taking-app), designed to provide a seamless and efficient platform for note-taking. It emphasizes secure user management, grammar enhancement, and a modern user interface.

### **Features**

- **User Management**: Create, update, and manage user accounts securely.
- **Notes Management**: Add, edit, and delete Markdown-formatted notes.
- **Grammar Checking**: Offers suggestions for correcting grammar and spelling mistakes in English and Spanish.
- **Search Functionality**: Fuzzy search bar powered by Fuse.js for quick and precise note retrieval.
- **Authentication**: Uses encrypted cookies for a secure and reliable login experience.
- **Modern UI**: Built with Next.js and Tailwind, ensuring responsiveness and accessibility.

---

## 🛠️ **Tech Stack**

### **Backend**

- **Framework**: [Hono](https://hono.dev/)
- **Language**: TypeScript
- **Database**: Cloudflare D1 (via Prisma ORM)
- **Validation**: Zod
- **Hosting**: Cloudflare Workers

#### **API Routes**

1. **`/users`**: Manage user-related operations (create, find, update).
2. **`/notes`**: Handles CRUD operations for user notes. Requires authentication.
3. **`/auth`**: Manages login, logout, and cookie-based authentication.

#### **Challenges**: Grammar Checker

The most challenging part of the backend was implementing the **grammar checker**. Initial plans involved using complex natural language processing (NLP) techniques, but this was simplified to leverage dynamic programming for efficient spelling corrections:

- Utilized the **Wagner-Fischer algorithm** to calculate edit distances.
- Checked words against language-specific dictionaries (English/Spanish).
- Suggested corrections using cached dictionary lookups for performance optimization.

---

### **Frontend**

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Components**: [shadcn/ui](https://ui.shadcn.dev/)

#### **Features**

- User authentication ensures secure access to pages and actions.
- Leverages API endpoints to fetch and display user notes.
- Tailored UI for productivity with responsive design and dark mode support.
- Fuzzy search functionality for quick note lookups.

---

## 🔍 **Search Functionality with Fuse.js**

### **Description**

The app includes a powerful, client-side search bar powered by **Fuse.js**. This feature allows users to search through their notes quickly and effectively.

### **How It Works**

1. The search bar uses the **Fuse.js** fuzzy-search library to find relevant notes from the user's pre-fetched list.
2. Matching notes are stored in a JSON object and saved as a browser cookie.
3. The frontend reads this cookie to display the search results to the user.
4. After the results are shown, the cookie is cleared to prevent stale data from causing issues.

### **Why Fuse.js?**

- **Lightweight** and fast for client-side operations.
- Provides customizable search criteria (e.g., match by title, tags, or content).
- Supports fuzzy matching, improving user experience for approximate searches.

---

## 🚧 **Key Challenges**

1. **Grammar Checker**  
   Developing a real-time grammar checker with minimal resource overhead was demanding. Initially researched methods such as n-grams and probabilistic ranking (inspired by [this paper](https://ar5iv.org/html/1910.11242)), but opted for a practical, efficient solution using:

   - **Wagner-Fischer Algorithm**
   - Language-specific dictionary lookups (cached for performance).

2. **Authentication with Cookies**  
   Implementing secure cookie-based authentication in Cloudflare Workers required careful handling of CORS, encryption, and session management.

3. **Search Implementation**  
   Ensuring a smooth integration of Fuse.js for client-side searching, along with reliable cookie handling, required precise coordination between backend and frontend logic.

---

## 🚀 **Installation and Usage**

### **Backend Setup**

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables for database and authentication secrets.
4. Start the development server:
   ```bash
   npm run dev
   ```

### **Frontend Setup**

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables for API URL.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔮 **Future Improvements**

### Backend

- **Full-Text Search**: Allow searching notes based on keywords or tags. (Maybe)
- **Collaborative Notes**: Enable multiple users to edit a note simultaneously. (Maybe)

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## 📜 **License**

Someday
