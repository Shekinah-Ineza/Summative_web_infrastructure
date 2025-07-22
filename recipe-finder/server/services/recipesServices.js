const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { ingredient } = req.query;
    const response = await axios.get(
      `https://api.edamam.com/search?q=${ingredient}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`
    );
    res.json(response.data.hits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};