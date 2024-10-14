export default class Comment {
    constructor(content, articleId) {
        this.id = (Math.floor(Math.random() * 90000000) + 10000000).toString(),
            this.content = content,
            this.date = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            this.votes = { upVotes: 0, downVotes: 0 },
            this.articleId = articleId
    }
    async addComment(articleId, content) {

    }
    async deleteComment(articleId, commentId, content) {

    }
}