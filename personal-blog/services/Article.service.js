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
    async addArticle(params) {

    }
    async editArticle(params) {

    }
    async deleteArticle(params) {

    }
}