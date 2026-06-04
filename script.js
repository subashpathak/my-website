const articles = [
    {
        category: "Technology",
        title: "The Future of Minimalist Web Design",
        excerpt: "Exploring how less is becoming more in modern web development, and why users prefer simple, fast, and accessible interfaces.",
        link: "#"
    },
    {
        category: "Productivity",
        title: "Finding Focus in a Noisy World",
        excerpt: "Strategies for deep work and avoiding the constant pull of digital distractions in our everyday lives.",
        link: "#"
    },
    {
        category: "Life",
        title: "The Art of Traveling Light",
        excerpt: "Lessons learned from living out of a single backpack for a year, and how physical minimalism translates to mental clarity.",
        link: "#"
    },
    {
        category: "Design",
        title: "Typography as the Foundation of UI",
        excerpt: "Why choosing the right font is often more important than choosing the right color palette.",
        link: "#"
    }
];

const articlesContainer = document.getElementById('articles-container');

if (articlesContainer) {
    articles.forEach((article, index) => {
        const articleEl = document.createElement('a');
        articleEl.href = article.link;
        articleEl.className = 'article-card';
        articleEl.style.animationDelay = `${index * 0.15}s`;
        
        articleEl.innerHTML = `
            <span class="article-category">${article.category}</span>
            <h2 class="article-title">${article.title}</h2>
            <p class="article-excerpt">${article.excerpt}</p>
        `;
        
        articlesContainer.appendChild(articleEl);
    });
}