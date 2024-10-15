export default class Article {
    constructor(title, content) {
        this.id = (Math.floor(Math.random() * 90000000) + 10000000).toString(),
            this.title = title,
            this.content = content,
            this.date = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            this.liking = { likes: 0, dislikes: 0 },
            this.comments = []
    }
    async getArticleById(data, id) {
        if (data.length === 0) {
            throw new Error(`There are no articles.`);
        }
        const article = data.find((article) => article.id === id)
        if (typeof article === "undefined") {
            throw new Error(`Article with id ${id} not found.`);
        }
        return article
    }
    async addArticle(title, content) {
        try {
            const article = new Article(title, content)
            return article
        } catch (error) {
            throw new Error("Unexpected Error");
        }
    }
    async updateArticle(data, updates, articleId) {
        const article = await this.getArticleById(data, articleId)
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === "liking" && value === "dislike") {
                    article[key].dislikes += 1
                } else if (key === "liking" && value === "like") {
                    article[key].likes += 1
                } else {
                    article[key] = value
                }
            }
        });
        return data
    }
    async deleteArticle(data, id) {
        await this.getArticleById(data, id)
        data.forEach((article, i) => {
            if (article.id === id) {
                data.splice(i, 1)
            }
        })
        return data
    }
}