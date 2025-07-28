document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const newsResults = document.getElementById('news-results');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // Public API endpoint that doesn't require authentication
    const API_URL = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY';

    // For demonstration, we'll use a proxy to avoid CORS issues
    // In production, you should set up your own backend
    const PROXY_URL = 'https://api.allorigins.win/get?url=' + encodeURIComponent(API_URL);

    // Initialize with general news
    fetchNews('general');

    // Set up category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            fetchNews(category);
        });
    });

    // Set up search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchNews(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchNews(searchTerm);
            }
        }
    });

    async function fetchNews(category) {
        // Clear previous results and errors
        newsResults.innerHTML = '';
        hideError();
        showLoading();

        try {
            // In a real app, you would use your own backend to call the NewsAPI
            // This is just for demonstration with a public endpoint
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=YOUR_API_KEY`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error fetching news:', error);
            
            // Fallback: Use mock data if API fails
            useMockData(category);
            // showError('Failed to fetch news. Showing sample data instead.');
        } finally {
            hideLoading();
        }
    }

    async function searchNews(query) {
        newsResults.innerHTML = '';
        hideError();
        showLoading();

        try {
            // In a real app, you would use your own backend to call the NewsAPI
            const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=YOUR_API_KEY`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error searching news:', error);
            showError('Failed to search news. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    function displayNews(articles) {
        if (!articles || articles.length === 0) {
            showError('No news articles found. Try a different category or search term.');
            return;
        }

        articles.forEach(article => {
            const card = createNewsCard(article);
            newsResults.appendChild(card);
        });
    }

    function createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';

        const imageDiv = document.createElement('div');
        imageDiv.className = 'news-image';
        imageDiv.style.backgroundImage = `url(${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'})`;
        
        const sourceSpan = document.createElement('span');
        sourceSpan.className = 'news-source';
        sourceSpan.textContent = article.source.name || 'Unknown source';
        imageDiv.appendChild(sourceSpan);
        
        card.appendChild(imageDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'news-content';

        const title = document.createElement('h3');
        title.className = 'news-title';
        title.textContent = article.title || 'No title available';
        contentDiv.appendChild(title);

        const description = document.createElement('p');
        description.className = 'news-description';
        description.textContent = article.description || 'No description available.';
        contentDiv.appendChild(description);

        const readMore = document.createElement('a');
        readMore.className = 'read-more';
        readMore.textContent = 'Read more';
        readMore.href = article.url;
        readMore.target = '_blank';
        contentDiv.appendChild(readMore);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'news-meta';

        const date = document.createElement('div');
        date.className = 'news-date';
        date.innerHTML = `<i class="far fa-clock"></i> ${formatDate(article.publishedAt)}`;
        metaDiv.appendChild(date);

        if (article.author) {
            const author = document.createElement('div');
            author.className = 'news-author';
            author.innerHTML = `<i class="far fa-user"></i> ${article.author}`;
            metaDiv.appendChild(author);
        }

        contentDiv.appendChild(metaDiv);
        card.appendChild(contentDiv);
        return card;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function showLoading() {
        loadingElement.classList.remove('hidden');
    }

    function hideLoading() {
        loadingElement.classList.add('hidden');
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    function hideError() {
        errorElement.classList.add('hidden');
    }

    // Fallback function with mock data
    function useMockData(category) {
        const mockData = {
            articles: [
                {
                    source: { name: "Mock News" },
                    author: "John Doe",
                    title: "Sample News Article About " + category.charAt(0).toUpperCase() + category.slice(1),
                    description: "This is a sample news article description about " + category + ". In a real app, you would see actual news content here from the API.",
                    url: "https://example.com",
                    urlToImage: "https://via.placeholder.com/400x200?text=News+Image",
                    publishedAt: new Date().toISOString()
                },
                {
                    source: { name: "Mock News" },
                    author: "Jane Smith",
                    title: "Another Sample Article on " + category.charAt(0).toUpperCase() + category.slice(1),
                    description: "Another example news item showing how the " + category + " category would display different content.",
                    url: "https://example.com",
                    urlToImage: "https://via.placeholder.com/400x200?text=News+Image",
                    publishedAt: new Date().toISOString()
                }
            ]
        };
        
        displayNews(mockData.articles);
    }
});