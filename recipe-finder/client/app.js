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
        <h3>${recipe.recipe.label}</h3>
        <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
        <p>Calories: ${Math.round(recipe.recipe.calories)}</p>
        <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
      `;
      resultsDiv.appendChild(recipeDiv);
    });
  } catch (error) {
    resultsDiv.innerHTML = '<p>Error loading recipes</p>';
  }
}