document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById("content");

    // Router function
    async function loadContent() {
        // Get the hash without the '#' symbol. Default to 'home'
        let hash = window.location.hash.substring(1) || 'home';
        
        // Basic protection against directory traversal
        if (hash.includes('..')) {
            hash = 'home';
        }

        // Map the route to the correct markdown file path
        let mdPath = `content/${hash}.md`;
        
        // Special case for the blog listing
        if (hash === 'blog') {
            mdPath = 'content/blog/index.md';
        } else if (hash.startsWith('blog/')) {
            mdPath = `content/${hash}.md`;
        }

        try {
            contentDiv.innerHTML = '<p>Loading...</p>';
            
            const response = await fetch(mdPath);
            
            if (!response.ok) {
                throw new Error(`Page not found (${response.status})`);
            }

            const markdownText = await response.text();
            
            // Parse markdown to HTML using marked.js
            const htmlContent = marked.parse(markdownText);
            contentDiv.innerHTML = htmlContent;

        } catch (error) {
            console.error("Error loading content:", error);
            contentDiv.innerHTML = `
                <h2>404 - Not Found</h2>
                <p>The content you are looking for could not be found.</p>
                <a href="#home">Return Home</a>
            `;
        }
    }

    // Listen for hash changes
    window.addEventListener("hashchange", loadContent);

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Initialize theme
    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
    }

    themeToggleBtn.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });

    // Initial load
    loadContent();
});
