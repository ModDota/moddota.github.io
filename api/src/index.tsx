import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
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
  }, []);

  const appContext = {
    darkmode,
    setDarkmode(dark: boolean) {
      window.localStorage.setItem("theme", dark ? "dark" : "");
      setDarkmode(dark);
    },
  };

  return (
    <AppContext.Provider value={appContext}>
      <ThemeProvider theme={darkmode ? themeModdotaDark : themeModdotaLight}>
        <AppWrapper>
          <GlobalStyle />
          <HashRouter>
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

createRoot(document.getElementById("root")!).render(<App />);
