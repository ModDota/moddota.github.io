import { createContext } from "react";
import { Declaration } from "~components/Docs/api";

export type DeclarationsContextType = {
  root: string;
  declarations: Declaration[];
};

export const DeclarationsContext = createContext<DeclarationsContextType>({ root: "", declarations: [] });
