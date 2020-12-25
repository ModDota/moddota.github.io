import React from "react";

interface AppContextProps {
    darkmode: boolean;
    setDarkmode: (enabled: boolean) => void;
};

export const AppContext = React.createContext<AppContextProps>({
    darkmode: false,
    setDarkmode(_) {}
});
