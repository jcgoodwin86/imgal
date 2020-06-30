import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body{font-family: 'Work Sans'}

  .content img {
    height: 500px;
  }
  .content{
    display: grid;
    grid-gap: 2em; /* [1] Add some gap between rows and columns */
    grid-template-columns: repeat( auto-fill, minmax( 200px, 1fr ) ); /* [2] Make columns adjust according to the available viewport */
    grid-auto-rows: 250px; /* [3] Set the height for implicitly-created row track */
  }
`;
