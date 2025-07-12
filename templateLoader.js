document.addEventListener("DOMContentLoaded", () => {
    // Load essential components first
    Promise.all([
        loadTemplate("header", "components/header.html"),
        loadTemplate("footer", "components/footer.html")
    ]).then(() => {
        // Then check if comments container exists and load it
        if (document.getElementById("comments")) {
            loadTemplate("comments", "components/comments.html")
                .then(() => {
                    // Once comments are loaded, trigger an event
                    const event = new CustomEvent('commentsLoaded');
                    document.dispatchEvent(event);
                });
        }
    });
});

function loadTemplate(id, file) {
    return new Promise((resolve, reject) => {
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${file}: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = data;
                    resolve();
                } else {
                    reject(`Element with ID "${id}" not found`);
                }
            })
            .catch(error => {
                console.error(`Error loading ${file}:`, error);
                reject(error);
            });
    });
}