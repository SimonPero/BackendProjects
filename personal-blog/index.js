import express from "express"
import bodyParser from "body-parser"
import FileManager from "./services/FileManager.service.js";
import Article from "./services/Article.service.js";
import Comment from "./services/Comment.service.js"
import authMiddleware from "./middleware.js";

const fileManager = new FileManager()
const articleService = new Article()
const commentService = new Comment()

const app = express()
const port = 8080

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.get("/home", async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})
app.get("/article/:id", async (req, res) => {
    try {
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
            <header class="title">
                <h1>${article.title}</h1>
                <h3>${article.date}</h3>
            </header>
            <main>
                <p>${article.content}</p>
                <section>
                    <button class="liking-action" article-id=${article.id} liking-type="like">👍${article.liking.likes}</button>
                    <button class="liking-action" article-id=${article.id} liking-type="dislike">👎${article.liking.dislikes}</button>
                </section>
            </main>
            <footer>
                <form action="/addComment/${article.id}" method="POST" class="form-container">
                <input type="text" name="comment" placeholder="Write your comment" class="input-field">
                <button type="submit" class="action-button">Add comment</button>
                </form>
                <ul class="list-style-none">
                ${comments.length > 0
                ? comments.map(comment => `
                        <li class="flex">
                            <p>${comment.content}</p>
                            <div>
                                <button class="vote-action" comment-id=${comment.id} vote-type="upVote" article-id=${article.id}>
                                    ⬆️
                                </button>
                                <p>${comment.votes}</p>
                                <button class="vote-action" comment-id=${comment.id} vote-type="downVote" article-id=${article.id}>
                                    ⬇️
                                </button>
                            </div>
                        </li>
                    `).join('')
                : `<li class="flex"><a>No comments available</a></li>`}
                </ul>
            </footer>
            <script src="/votesLiking.js"></script>
        </body>
        </html>
        `)
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})

app.put("/article/liking", async (req, res) => {
    try {
        let articlesData = await fileManager.readFile("articles");
        const likingType = req.body.likingType;
        const articleId = req.body.articleId;
        articlesData = await articleService.updateArticle(articlesData, { liking: likingType }, articleId)

        await fileManager.writeFile("articles", articlesData);

        res.status(200).json({ success: true, articleId });
    } catch (error) {
        console.error("Error while processing vote:", error.message);
        res.status(500).json({ message: error.message });
    }
});
app.put("/comment/vote/:id", async (req, res) => {
    try {
        let commentData = await fileManager.readFile("comments");
        const voteType = req.body.voteType;
        const articleId = req.body.articleId;
        const commentId = req.params.id;

        const comment = commentData.find(comment => comment.id === commentId);
        if (!comment) throw new Error('Comment not found');

        commentData = await commentService.updateComment(commentData, commentId, voteType);
        await fileManager.writeFile("comments", commentData);

        res.status(200).json({ success: true, articleId });
    } catch (error) {
        console.error("Error while processing vote:", error.message);
        res.status(500).json({ message: error.message });
    }
});


app.get("/admin", authMiddleware, async (req, res) => {
    try {
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
                            <a class="date delete-link" data-id="${article.id}">Delete</a>
                        </div>
                    </li>
                `).join('') : `
                    <li class="flex">
                        <a>No articles available</a>
                    </li>   
                    `}
                </ul>
            </main>
            <script src="/index.js"></script>
        </body>
        </html>
        `)
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})

app.get("/new", authMiddleware, async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})
app.post("/new", authMiddleware, async (req, res) => {
    try {
        const articleData = await fileManager.readFile("articles")
        const title = req.body.title
        const content = req.body.content
        const newArticle = await articleService.addArticle(title, content)
        articleData.push(newArticle)
        await fileManager.writeFile("articles", articleData)
        res.redirect("admin")
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})

app.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const articleId = req.params.id;
        let articleData = await fileManager.readFile("articles");
        articleData = await articleService.deleteArticle(articleData, articleId);
        await fileManager.writeFile("articles", articleData);

        res.status(200).send({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
});

app.get("/edit/:id", async (req, res) => {
    try {
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
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})
app.post("/edit/:id", async (req, res) => {
    try {
        const articleId = req.params.id
        const title = req.body.title
        const content = req.body.content
        let articlesData = await fileManager.readFile("articles")
        articlesData = await articleService.updateArticle(articlesData, { title: title, content: content }, articleId)
        await fileManager.writeFile("articles", articlesData)
        res.redirect("/admin")
    } catch (error) {
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
})
app.get("/error", async (req, res) => {
    const errorMessage = req.query.message;
    res.send(
        `
        <h1>Error</h1>
        <p>${errorMessage}</p>
        `
    );
});
app.post("/addComment/:id", async (req, res) => {
    const articleId = req.params.id
    const commentsData = await fileManager.readFile("comments")
    const articleData = await fileManager.readFile("articles")
    const content = req.body.comment
    const newComment = await commentService.addComment(articleId, content)
    articleData.find((article) => {
        if (article.id === articleId) {
            article.comments.push({ id: newComment.id })
        }
    })
    commentsData.push(newComment)
    await fileManager.writeFile("comments", commentsData)
    await fileManager.writeFile("articles", articleData)
    res.redirect(`/article/${articleId}`)
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