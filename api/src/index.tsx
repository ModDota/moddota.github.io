import React, { useEffect } from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { NavBar } from "~components/layout/NavBar";
import { themeModdotaDark, themeModdotaLight } from "~components/Themes";
import { AppRoutes } from "./pages";
import { GlobalStyle } from "~components/GlobalStyle";
import { AppContext } from "~components/AppContext";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const PageContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

function App() {
  const [darkmode, setDarkmode] = React.useState(false);

  useEffect(() => {
    const dark = window.localStorage.getItem('darkmode');
    setDarkmode(dark == true.toString());
  });
  
  const appContext = {
    darkmode: darkmode,
    setDarkmode(dark : boolean) {
      window.localStorage.setItem('darkmode', dark.toString());
      setDarkmode(dark);
    }
  };

  return (
    <AppContext.Provider value={appContext}>
      <ThemeProvider theme={darkmode ? themeModdotaDark : themeModdotaLight}>
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
      </ThemeProvider>
    </AppContext.Provider>
  );
}

render(<App />, document.querySelector("#root"));
