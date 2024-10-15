export default class Comment {
    constructor(content, articleId) {
        this.id = (Math.floor(Math.random() * 90000000) + 10000000).toString(),
            this.content = content,
            this.date = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            this.votes = 0,
            this.articleId = articleId
    }
    async addComment(articleId, content) {
        const newComment = new Comment(content, articleId)
        return newComment
    }
    async updateComment(data, commentId, voteType) {
        data.find((comment) => {
            if (comment.id === commentId && voteType === "upVote") {
                comment.votes += 1
            } else if ((comment.id === commentId && voteType === "downVote")) {
                comment.votes -= 1
            }
        })
        return data
    }
}