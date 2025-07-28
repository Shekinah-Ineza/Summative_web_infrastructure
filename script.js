document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const newsResults = document.getElementById('news-results');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    const API_KEY = 'bba49a03bb91fa372478a548741d0300'; // Replace this with your GNews.io API key for more results
    const COUNTRY = 'us';
    const LANGUAGE = 'en';

    // Initialize with general (world) news
    fetchNews('world');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            fetchNews(category);
        });
    });

    searchBtn.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchNews(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchNews(searchTerm);
            }
        }
    });

    async function fetchNews(category) {
        newsResults.innerHTML = '';
        hideError();
        showLoading();

        try {
            const response = await fetch(`https://gnews.io/api/v4/top-headlines?topic=${category}&lang=${LANGUAGE}&country=${COUNTRY}&apikey=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error fetching news:', error);
            showError('Failed to fetch news. Please try again later.');
        } finally {
            hideLoading();
        }
    }

    async function searchNews(query) {
        newsResults.innerHTML = '';
        hideError();
        showLoading();

        try {
            const response = await fetch(`https://gnews.io/api/v4/search?q=${query}&lang=${LANGUAGE}&country=${COUNTRY}&apikey=${API_KEY}`);
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
        imageDiv.style.backgroundImage = `url(${article.image || 'https://via.placeholder.com/400x200?text=No+Image'})`;

        const sourceSpan = document.createElement('span');
        sourceSpan.className = 'news-source';
        sourceSpan.textContent = article.source?.name || 'Unknown source';
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

        if (article.source?.name) {
            const author = document.createElement('div');
            author.className = 'news-author';
            author.innerHTML = `<i class="far fa-user"></i> ${article.source.name}`;
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
});
