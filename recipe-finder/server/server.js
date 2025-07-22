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
