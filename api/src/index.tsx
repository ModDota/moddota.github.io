import { darken, lighten } from 'polished';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { NavBar } from '~components/layout/NavBar';
import { colors } from '~utils/constants';
import { AppRoutes } from './pages';

const GlobalStyle = (() => {
  const css = createGlobalStyle;
  return css`
    html,
    body,
    #root {
      width: 100%;
      height: 100%;
      margin: 0;
    }

    ::-webkit-scrollbar {
      width: 9px;

      &-track {
        background: ${darken(0.09, colors.background)};
      }

      &-thumb {
        background: ${lighten(0.28, colors.background)};
        border-radius: 4px;

        &:hover {
          background: ${lighten(0.24, colors.background)};
        }
      }
    }
  `;
})();

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: ${colors.background};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  color: ${colors.text};
`;

const PageContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

function App() {
  return (
    <AppWrapper>
      <GlobalStyle />
      <HashRouter hashType="hashbang">
        <NavBar />
        <PageContent>
          <React.Suspense fallback={null}>
            <AppRoutes />
          </React.Suspense>
        </PageContent>
      </HashRouter>
    </AppWrapper>
  );
}

render(<App />, document.querySelector('#root'));
