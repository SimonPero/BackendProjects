import express from "express"
import FileManager from "./services/FileManager.service.js";
import Article from "./services/Article.service.js";
import authMiddleware from "./middleware.js";
const fileManager = new FileManager()
const articleService = new Article()

const app = express()
const port = 8080

app.use(express.static('public'));
app.use(express.json())

app.get("/home", async (req, res) => {
    let dataArray = await fileManager.readFile("articles")
    if (dataArray === "File not found" || dataArray.length === 0) {
        dataArray = false
    }
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link rel="stylesheet" href="/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
            />
        </head>
        <body class="open-sans">
            <header><h1 class="title">Personal Blog</h1></header>
            <main>
                <ul class="list-style-none">
                ${dataArray ? dataArray.map((article) => `
                    <li class="flex">
                        <a href="/article/${article.id}">${article.title}</a>
                        <p class="date">${article.date}</p>
                    </li>
                `).join('') : `
                    <li class="flex">
                        <a>No articles available</a>
                    </li>   
                    `}
                </ul>
            </main>
        </body>
        </html>
        `)
})
app.get("/article/:id", async (req, res) => {
    let articleId = req.params.id
    let articlesData = await fileManager.readFile("articles")
    let commentsData = await fileManager.readFile("comments")
    if (articlesData === "File not found") {
        dataArray = false
    }
    const article = await articleService.getArticleById(articlesData, articleId)
    if (articlesData === "File not found") {
        dataArray = false
    }
    const comments = commentsData.filter(comment => comment.articleId === articleId);
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link rel="stylesheet" href="/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
            />
        </head>
        <body class="open-sans">
            ${article ?
            `
                <header class="title">
                    <h1>${article.title}</h1>
                    <h3>${article.date}</h3>
                </header>
                <main>
                    <p>${article.content}</p>
                    <section>
                        <button>👍${article.liking.likes}</button>
                        <button>👎${article.liking.dislikes}</button>
                    </section>
                </main>
                <footer>
                    <form action="/addComment" method="POST" class="form-container">
                    <input type="text" name="comment" placeholder="Write your comment" class="input-field">
                    <button type="submit" class="action-button">Add comment</button>
                    </form>
                    <ul class="list-style-none">
                      ${comments.length > 0
                ? comments.map(comment => `
                            <li class="flex">
                                <p>${comment.content}</p>
                                <div>
                                    <button>
                                        <p>⬆️ 0</p> <!-- Placeholder for upvotes -->
                                    </button>
                                    <button>
                                        <p>⬇️ 0</p> <!-- Placeholder for downvotes -->
                                    </button>
                                </div>
                            </li>
                        `).join('')
                : `<li class="flex"><a>No comments available</a></li>`}
                    </ul>
                </footer>
            `
            : `
                <p> nothing found</p>
                `}
        </body>
        </html>
        `)
})

app.get("/admin", authMiddleware, async (req, res) => {
    let dataArray = await fileManager.readFile("articles")
    if (dataArray === "File not found" || dataArray.length === 0) {
        dataArray = false
    }
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link rel="stylesheet" href="/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
            />
        </head>
        <body class="open-sans">
            <header class="flex">
            <h1>Personal Blog</h1>
            <h4><a href="/new">+ Add</a></h4>
            </header>
            <main>
                <ul class="list-style-none">
                ${dataArray ? dataArray.map((article) => `
                    <li class="flex">
                        <a href="/article/${article.id}">${article.title}</a>
                        <div>
                            <a href="/edit/${article.id}" class="date">Edit</a>
                            <a href="/delete/${article.id}" class="date">Delete</a>
                        </div>
                    </li>
                `).join('') : `
                    <li class="flex">
                        <a>No articles available</a>
                    </li>   
                    `}
                </ul>
            </main>
        </body>
        </html>
        `)
})
app.get("/new", authMiddleware, async (req, res) => {
    let dataArray = await fileManager.readFile("articles")
    if (dataArray === "File not found" || dataArray.length === 0) {
        dataArray = false
    }
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link rel="stylesheet" href="/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
            />
        </head>
        <body class="open-sans">
             <header class="flex header-bar">
                <h1>New Article</h1>
            </header>
            <form method="POST" class="form-container">
                <input type="text" name="title" placeholder="Article Title" class="input-field">
                <textarea name="content" placeholder="Article Content" class="textarea-field"></textarea>
                <button type="submit" class="action-button">Publish</button>
            </form>
        </body>
        </html>
        `)
})
app.get("/edit/:id", async (req, res) => {
    let articleId = req.params.id
    let articlesData = await fileManager.readFile("articles")
    const article = await articleService.getArticleById(articlesData, articleId)
    if (articlesData === "File not found") {
        dataArray = false
    }
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link rel="stylesheet" href="/style.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
            />
        </head>
        <body class="open-sans">
             <header class="flex header-bar">
                <h1>New Article</h1>
            </header>
            <form method="POST" class="form-container">
                <input type="text" name="title" placeholder="Article Title" class="input-field" value="${article.title}">
                <textarea name="content" placeholder="Article Content" class="textarea-field">${article.content}</textarea>
                <button type="submit" class="action-button">Edit</button>
            </form>
        </body>
        </html>
        `)
})
app.get("/", async (req, res) => {
    res.redirect("/home")
})
app.listen(port, async () => {
    try {
        console.log(`Servidor escuchando http://localhost:${port}`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});