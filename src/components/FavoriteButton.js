import React, { useState } from 'react';
import clipboardCopy from 'clipboard-copy';
// import { useHistory } from 'react-router-dom';
// import context from 'react-bootstrap/esm/AccordionContext';

function FavoriteButton() {
  const [copy, setCopy] = useState(false);
  function copyLink() {
    clipboardCopy(window.location.href);
    setCopy(true);
  }

  return (
    <main>
      <div>
        {copy && <p>Link copied!</p> }

        <button
          type="submit"
          data-testid="share-btn"
          onClick={ copyLink }
        >
          Compartilhar

        </button>

        <button
          type="submit"
          data-testid="favorite-btn"
        >
          Favoritar

        </button>
      </div>
      {/* </div> */}
    </main>

  );
}

export default FavoriteButton;
