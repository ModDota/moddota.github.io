import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { NavBar } from "../../api/src/components/layout/NavBar";
import { themeModdotaDark, themeModdotaLight } from "../../api/src/components/Themes";
import { AppRoutes } from "../../api/src/pages";
import { GlobalStyle } from "../../api/src/components/GlobalStyle";
import { AppContext } from "../../api/src/components/AppContext";
import Layout from '@theme/Layout';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

const PageContent = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

function App() {
  const [darkmode, setDarkmode] = React.useState(false);

  useEffect(() => {
    const themeName = window.localStorage.getItem("theme");
    setDarkmode(
      themeName === "dark" || (themeName === null && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
  });

  const appContext = {
    darkmode,
    setDarkmode(dark: boolean) {
      window.localStorage.setItem("theme", dark ? "dark" : "");
      setDarkmode(dark);
    },
  };

  return (
    <Layout title="API">
    <AppContext.Provider value={appContext}>
      <ThemeProvider theme={darkmode ? themeModdotaDark : themeModdotaLight}>
        <AppWrapper>
          <GlobalStyle />
            <NavBar />
            <PageContent>
              <React.Suspense fallback={null}>
                <AppRoutes />
              </React.Suspense>
            </PageContent>
        </AppWrapper>
      </ThemeProvider>
    </AppContext.Provider>
    </Layout>
  );
}

export default App;
