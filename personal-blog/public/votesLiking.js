const votes = document.querySelectorAll(".vote-action")
const linkings = document.querySelectorAll(".liking-action")

linkings.forEach((liking) => {
    liking.addEventListener("click", async (e) => {
        e.preventDefault()
        const articleId = liking.getAttribute("article-id")
        const likingType = liking.getAttribute("liking-type")
        try {
            const res = await fetch(`/article/liking`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ likingType: likingType, articleId: articleId }),
            });
            if (!res.ok) throw new Error('Failed to like');
            window.location.href = `/article/${articleId}`;
        } catch (error) {
            alert(error.message || 'An error occurred');
        }
    })
})


votes.forEach((vote) => {
    vote.addEventListener("click", async (e) => {
        e.preventDefault();
        const commentId = vote.getAttribute('comment-id');
        const voteType = vote.getAttribute("vote-type")
        const articleId = vote.getAttribute("article-id")
        try {
            const res = await fetch(`/comment/vote/${commentId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voteType: voteType, articleId: articleId }),
            });
            if (!res.ok) throw new Error('Failed to vote');
            window.location.href = `/article/${articleId}`;
        } catch (error) {
            alert(error.message || 'An error occurred');
        }
    });
});