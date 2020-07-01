import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body{font-family: 'Work Sans'}

  .content{
    margin: 50px;
  }
`;
