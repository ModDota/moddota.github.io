import React from "react";

interface AppContextProps {
  darkmode: boolean;
  setDarkmode: (enabled: boolean) => void;
}

export const AppContext = React.createContext<AppContextProps>({
  darkmode: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDarkmode(_) {},
});
