import { DeclarationsContext, DeclarationsContextType } from "~components/Docs/DeclarationsContext";
import { HashScrollHandler } from "~components/ElementLink";
import { DeclarationsSidebar, HoistType } from "./DeclarationsSidebar";
import { ContentList } from "~components/Docs/ContentList";
import React from "react";

export default function DeclarationsPage({ context, hoist }: { context: DeclarationsContextType; hoist: HoistType[] }) {
  return (
    <>
      <DeclarationsContext.Provider value={context}>
        <HashScrollHandler />
        <DeclarationsSidebar hoist={hoist} />
        <ContentList />
      </DeclarationsContext.Provider>
    </>
  );
}
