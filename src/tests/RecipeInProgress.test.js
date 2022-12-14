import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Provider from '../context/Provider';
import rendeWithRouter from './helpers/renderWithRouter';
import App from '../App';
import {
    mockFoodWithId,
    drinksRecomendation,
    ggDrinkRecipe, foodsRecomendation } from './helpers/mockData';

describe('Verifica renderização  da página de In progress', () => {
  test('Verifica se os detalhes renderizados para uma receita na rota /foods', async () => {

  fetch = jest.fn().mockImplementation((url) => {
    if (url == 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771') {
      return Promise.resolve({
        json: jest.fn().mockResolvedValue(mockFoodWithId)
      })
    } else {
      return Promise.resolve({
        json: jest.fn().mockResolvedValue(drinksRecomendation)
      })
    }
  })

  const { history } = rendeWithRouter(<Provider><App /></Provider>);

  history.push('/foods/52771/in-progress');

  await waitFor(() => expect(fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771'));

  expect(screen.getByTestId('recipe-photo').src).toBe('https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg');
  expect(screen.getByTestId('recipe-title').innerHTML).toBe('Spicy Arrabiata Penne');
  expect(screen.getByTestId('recipe-category').innerHTML).toBe('Vegetarian');
  expect(screen.getByTestId('recipe-category')).toBeInTheDocument();
  expect(screen.getByTestId('instructions')).toBeInTheDocument();
  expect(screen.getByTestId('share-btn')).toBeInTheDocument();
  expect(screen.getByTestId('favorite-btn')).toBeInTheDocument();
  expect(screen.getByTestId('finish-recipe-btn')).toBeInTheDocument();
  expect(screen.getByTestId('finish-recipe-btn').innerHTML).toBe('Finish Recipe');
  expect(screen.getAllByTestId(/ingredient-step/i).length).toBe(8);

  userEvent.click(screen.getAllByRole("checkbox")[0]);
  userEvent.click(screen.getAllByRole("checkbox")[1]);
  userEvent.click(screen.getAllByRole("checkbox")[2]);
  userEvent.click(screen.getAllByRole("checkbox")[3]);

  const check = JSON.parse(localStorage.getItem('inProgressRecipes'));
  expect(check.arr.length).toBe(4);

  userEvent.click(screen.getAllByRole("checkbox")[2]);
  userEvent.click(screen.getAllByRole("checkbox")[3]);

  const { arr } = JSON.parse(localStorage.getItem('inProgressRecipes'));
  expect(arr.length).toBe(2);

  userEvent.click(screen.getAllByRole("checkbox")[2]);
  userEvent.click(screen.getAllByRole("checkbox")[3]);
  userEvent.click(screen.getAllByRole("checkbox")[4]);
  userEvent.click(screen.getAllByRole("checkbox")[5]);
  userEvent.click(screen.getAllByRole("checkbox")[6]);
  userEvent.click(screen.getAllByRole("checkbox")[7]);

  const done = JSON.parse(localStorage.getItem('inProgressRecipes'));
  expect(done.arr.length).toBe(8);

  expect(screen.getByRole("button", { name: /finish recipe/i })).not.toBeDisabled();

  userEvent.click(screen.getByRole("button", { name: /finish recipe/i }));

  const { pathname } = history.location;
  expect(pathname).toBe('/done-recipes');

  });

  test('Verifica o progresso de uma receita na rota /drinks', async () => {

  fetch = jest.fn().mockImplementation((url) => {
    if (url == 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997') {
      return Promise.resolve({
        json: jest.fn().mockResolvedValue(ggDrinkRecipe)
    })
    } else {
      return Promise.resolve({
        json: jest.fn().mockResolvedValue(foodsRecomendation)
      })
    }
  })

    const { history } = rendeWithRouter(<Provider><App /></Provider>);

    history.push('/drinks/15997/in-progress');

    await waitFor(() => expect(fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15997'));

    userEvent.click(screen.getAllByRole("checkbox")[0]);
    userEvent.click(screen.getAllByRole("checkbox")[1]);
    userEvent.click(screen.getAllByRole("checkbox")[2]);

    userEvent.click(screen.getByRole("button", { name: /finish recipe/i }));

    history.push('/done-recipes');

    const { pathname } = history.location;
    expect(pathname).toBe('/done-recipes');

  });

  test('Verifica se os itens continuam clicados ao retornar a página', async () => {

    fetch = jest.fn().mockImplementation((url) => {
      if (url == 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771') {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue(mockFoodWithId)
        })
      } else {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue(drinksRecomendation)
        })
      }
    })

    localStorage.setItem('inProgressRecipes', JSON.stringify({'id':'52771','arr':[1,0]}));

    const { history } = rendeWithRouter(<Provider><App /></Provider>);

    history.push('/foods/52771/in-progress');

    await waitFor(() => expect(fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771'));

    const pathname = history.location.pathname;
    expect(pathname).toBe('/foods/52771/in-progress');

    expect(screen.getByText("1 pound penne rigate").className).toBe('riscado');
    expect(screen.getAllByRole("checkbox")[0].checked).toBeTruthy();

    expect(screen.getByText("1/4 cup olive oil").className).toBe('riscado');
    expect(screen.getAllByRole("checkbox")[1].checked).toBeTruthy();

    userEvent.click(screen.getAllByRole("checkbox")[1]);

    expect(screen.getByText("1/4 cup olive oil").className).toBe('');
  });
});