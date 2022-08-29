import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import Context from '../context/Context';
import '../css/Footer.css';
import '../css/RecipesInProgress.css';

function RecipeInProgress() {
  const history = useHistory();
  const {
    recipeDetails,
    inProgressRecipes,
    setInProgressRecipes,
    requestData,
  } = useContext(Context);

  const { details: { strMeal,
    strDrinkThumb,
    strDrink,
    strMealThumb, strCategory, strInstructions }, ingredients } = recipeDetails;

  const { location: { pathname } } = history;
  const id = pathname.split('/')[2];
  const type = pathname.split('/')[1];

  useEffect(() => {
    requestData(type, id);
  }, [type, id]);

  const handleRiscar = (index) => {
    if (inProgressRecipes.arr.some((rec) => rec === index)) {
      setInProgressRecipes({
        ...inProgressRecipes,
        arr: [...inProgressRecipes.arr.filter((risco) => risco !== index)] });
    } else {
      setInProgressRecipes({
        ...inProgressRecipes,
        arr: [...inProgressRecipes.arr, index],
      });
    }
  };

  useEffect(() => {
    if (inProgressRecipes.arr.length !== 0) {
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    }
  }, [inProgressRecipes]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (data === null) {
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    } else {
      setInProgressRecipes({
        id,
        arr: data.arr,
      });
    }
  }, []);

  const handleSendDone = () => {
    history.push('/done-recipes');
  };

  return (
    <div>
      <div>
        <div>
          <img
            data-testid="recipe-photo"
            src={ strMealThumb || strDrinkThumb }
            alt={ strMeal || strDrink }
          />
        </div>
        <div>
          <span data-testid="recipe-title">{ strMeal || strDrink }</span>
          <span>
            <FavoriteButton />
          </span>
        </div>
        <div data-testid="recipe-category">{strCategory}</div>
      </div>
      <div>
        <div>Ingredientes:</div>
        <div>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li
                key={ index }
                data-testid={ `${index}-ingredient-step` }
              >
                {inProgressRecipes.id === id
                    && inProgressRecipes.arr.includes(index)
                  ? (
                    <input
                      type="checkbox"
                      name="ingredient"
                      value={ index }
                      onChange={ () => handleRiscar(index) }
                      checked
                    />
                  )
                  : (
                    <input
                      type="checkbox"
                      name="ingredient"
                      value={ index }
                      onChange={ () => handleRiscar(index) }
                    />
                  )}
                {inProgressRecipes.id === id
                    && inProgressRecipes.arr.includes(index)
                  ? (
                    <span className="riscado">{ingredient}</span>
                  )
                  : (
                    <span>{ingredient}</span>
                  )}

              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div>Instruções:</div>
        <div data-testid="instructions">{strInstructions}</div>
      </div>
      <div>
        <button
          data-testid="finish-recipe-btn"
          className="btn-finish-recipes"
          type="button"
          disabled={ ingredients.length !== inProgressRecipes.arr.length }
          onClick={ handleSendDone }
        >
          Finish Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeInProgress;
