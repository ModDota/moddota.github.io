import React from "react";
import { scopes } from "../data";
import DeclarationsPage from "../DeclarationsPage";

export default function VScriptsPage() {
  return (
    <DeclarationsPage
      context={scopes.vscripts}
      hoist={[
        {
          icon: "function",
          text: "Functions",
          scope: "functions",
          kind: "function",
        },
        {
          icon: "constant",
          text: "Constants",
          scope: "constants",
          kind: "constant",
        },
      ]}
    ></DeclarationsPage>
  );
}
