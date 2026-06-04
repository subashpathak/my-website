const articles = [
    {
        domain: "The Falsifiable",
        title: "The Logic of Scientific Discovery: A Re-evaluation",
        excerpt: "An exploration into Karl Popper's falsifiability and how it constructs the boundary between science and meaning.",
        link: "#"
    },
    {
        domain: "The Incerto",
        title: "Probability, Asymmetry, and Skin in the Game",
        excerpt: "Understanding true risk through Taleb's frameworks, shifting away from standard distributions towards chaotic reality.",
        link: "#"
    },
    {
        domain: "The Academy",
        title: "The Geometry of Truth: Plato's Forms",
        excerpt: "How the ancient world mapped logic to reality, and where Aristotelian deduction meets modern mathematics.",
        link: "#"
    },
    {
        domain: "The Will",
        title: "Embracing the Absurd: Amor Fati",
        excerpt: "Nietzsche's radical psychological response to randomness, suffering, and the fundamentally chaotic nature of existence.",
        link: "#"
    }
];

const articlesContainer = document.getElementById('articles-container');

if (articlesContainer) {
    articles.forEach((article, index) => {
        const articleEl = document.createElement('article');
        articleEl.className = 'article-card';
        articleEl.style.animationDelay = `${index * 0.15}s`;
        
        articleEl.innerHTML = `
            <span class="article-domain">${article.domain}</span>
            <a href="${article.link}" class="article-title">${article.title}</a>
            <p class="article-excerpt">${article.excerpt}</p>
            <a href="${article.link}" class="read-more">Read Essay →</a>
        `;
        
        articlesContainer.appendChild(articleEl);
    });
}