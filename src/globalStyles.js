import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
  } 

  body {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
  }

  h1 {
    color: ${(props) => props.theme.titles};
  }

  .accent {
    color: ${(props) => props.theme.accent};
  }
`;

export default GlobalStyles;
