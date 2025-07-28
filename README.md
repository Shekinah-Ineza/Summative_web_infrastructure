 News Aggregator Web App


Quick Start
1. Clone the repository:
```bash
git clone https://github.com/yourusername/news-aggregator.git
cd news-aggregator
```

2. Open in browser:
```bash
# For Linux/Mac:
open index.html

# For Windows:
start index.html
```

 📂 Project Structure
```
├── index.html          # Main application
├── style.css           # Stylesheet
├── script.js           # News fetching logic
├── assets/             # Static assets
│   ├── icons/          # App icons
│   └── images/         # Default images
└── README.md           # Documentation
```

 API Configuration
The app uses NewsAPI's free tier:
- No API key required for development
- Rate limited to 100 requests/day
- Categories: business, entertainment, general, health, science, sports, technology

 Features in Detail
- **Category Selection**: Browse news by topic
- **Search Function**: Find specific news articles
- **Article Cards**: Clean display with images and metadata
- **Responsive Design**: Works on all devices
- **Loading States**: Visual feedback during API calls

 Deployment
Automatically deployed via GitHub Pages:
1. Pushes to `main` branch trigger deployment
2. Site updates within 1-2 minutes
3. No build step required

 License
MIT License - Free to use and modify



