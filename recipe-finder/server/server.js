require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./services/recipeService');

const app = express();
app.use(cors());

app.get('/api/recipes', recipeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});