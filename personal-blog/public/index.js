const linksForDeleting = document.querySelectorAll(".delete-link");

linksForDeleting.forEach((link) => {
    link.addEventListener("click", async (e) => {
        e.preventDefault();

        const articleId = link.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this article?')) {
            try {
                const res = await fetch(`/delete/${articleId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {

                    window.location.href = "/admin";
                } else {
                    const errorData = await res.json();
                    alert(errorData.message || 'An error occurred');
                    window.location.href = "/error";
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the article');
            }
        }
    });
});