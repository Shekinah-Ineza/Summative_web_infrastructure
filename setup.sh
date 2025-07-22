#!/bin/bash

# Create project structure
mkdir -p recipe-finder/{server/services,client}
cd recipe-finder

# Create backend files
cat > server/server.js << 'EOL'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./services/recipeService');

const app = express();
app.use(cors());

app.get('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOL

cat > server/services/recipeService.js << 'EOL'
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { ingredient } = req.query;
    const response = await axios.get(
      `https://api.edamam.com/search?q=${ingredient}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`
    );
    res.json(response.data.hits.map(hit => ({
      label: hit.recipe.label,
      image: hit.recipe.image,
      calories: Math.round(hit.recipe.calories),
      url: hit.recipe.url
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};
EOL

cat > server/.env << 'EOL'
PORT=3000
EDAMAM_APP_ID=your_app_id_here
EDAMAM_API_KEY=your_api_key_here
EOL

# Create frontend files
cat > client/index.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <title>Recipe Finder</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Recipe Finder</h1>
    <input type="text" id="ingredientInput" placeholder="Enter ingredient...">
    <button onclick="searchRecipes()">Search</button>
    <div id="results"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>
EOL

cat > client/style.css << 'EOL'
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.container {
  text-align: center;
}
input {
  padding: 10px;
  width: 300px;
  margin-right: 10px;
}
button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
#results {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.recipe {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.recipe img {
  max-width: 100%;
  height: auto;
}
EOL

cat > client/app.js << 'EOL'
async function searchRecipes() {
  const ingredient = document.getElementById('ingredientInput').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`http://localhost:3000/api/recipes?ingredient=${ingredient}`);
    const recipes = await response.json();

    resultsDiv.innerHTML = recipes.length ? '' : '<p>No recipes found</p>';
    
    recipes.forEach(recipe => {
      const recipeDiv = document.createElement('div');
      recipeDiv.className = 'recipe';
      recipeDiv.innerHTML = `
        <h3>${recipe.label}</h3>
        <img src="${recipe.image}" alt="${recipe.label}">
        <p>Calories: ${recipe.calories}</p>
        <a href="${recipe.url}" target="_blank">View Recipe</a>
      `;
      resultsDiv.appendChild(recipeDiv);
    });
  } catch (error) {
    resultsDiv.innerHTML = '<p>Error loading recipes</p>';
  }
}
EOL

# Create package.json
cat > package.json << 'EOL'
{
  "name": "recipe-finder",
  "version": "1.0.0",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "dependencies": {
    "axios": "^0.27.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.1",
    "express": "^4.18.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}
EOL

# Install dependencies
npm install

echo "Setup complete!"
echo "1. Edit server/.env with your Edamam API keys"
echo "2. Run the app with: npm start"
echo "3. Open client/index.html in your browser"