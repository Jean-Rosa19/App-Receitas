import React, { useContext } from 'react';
import Context from '../context/Context';

function MealsDetails() {
  const {
    recipeDetails: { details, ingredients },
  } = useContext(Context);

  return (
    <div>
      <img
        data-testid="recipe-photo"
        src={ details.strMealThumb }
        alt={ details.strMeal }
      />
      <h2 data-testid="recipe-title">{ details.strMeal }</h2>
      <p data-testid="recipe-category">{ details.strCategory }</p>
      <ul>
        { ingredients.map((ingredient, index) => (
          <li
            key={ index }
            data-testid={ `${index}-ingredient-name-and-measure` }
          >
            { ingredient }
          </li>
        ))}
      </ul>
      <p data-testid="instructions">{ details.strInstructions }</p>
      <iframe
        width="853"
        height="480"
        src={ details.strYoutube }
        frameBorder="0"
        title="Embedded youtube"
        data-testid="video"
      />
    </div>
  );
}

export default MealsDetails;
