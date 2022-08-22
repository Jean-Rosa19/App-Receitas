import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import HeaderSearchIcon from './HeaderSearchIcon';
import SearchBar from './SearchBar';
import MyContext from '../context/MyContext';

function Header({ title }) {
  const [showSearchIcon, setshowSearchIcon] = useState(true);
  const [showSearchInput, setshowSearchInput] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { handleSearchChange, error } = useContext(MyContext);

  const handleIcons = () => {
    if (title === 'Favorite Recipes'
      || title === 'Done Recipes'
      || title === 'Profile') {
      setshowSearchIcon(false);
    }
  };

  const handleClickProfile = () => {
    setRedirect(true);
  };

  const handleShowInput = () => {
    setshowSearchInput(!showSearchInput);
  };

  useEffect(() => {
    handleIcons();
  }, []);

  return (
    <div>
      { error && global.alert('Your search must have only 1 (one) character') }
      { redirect && <Redirect to="/profile" />}
      <button
        type="button"
        onClick={ () => handleClickProfile() }
      >
        <img
          src={ profileIcon }
          alt="profileIcon"
          data-testid="profile-top-btn"
        />
      </button>
      { showSearchIcon && <HeaderSearchIcon handleShowInput={ handleShowInput } /> }
      { showSearchInput
        && <input
          type="text"
          data-testid="search-input"
          name="value"
          onChange={ handleSearchChange }
        /> }
      { showSearchInput && <SearchBar /> }
      <h1 data-testid="page-title">{ title }</h1>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string,
}.isRequired;

export default Header;
