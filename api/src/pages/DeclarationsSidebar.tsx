import React, { useContext } from "react";
import { DeclarationsContext } from "~components/Docs/DeclarationsContext";
import { DeclarationSidebarElement, SidebarElement, SidebarWrapper } from "~components/layout/Sidebar";
import { IconKind } from "~components/KindIcon";
import { Declaration } from "~components/Docs/api";

export type HoistType = {
  icon: IconKind;
  kind: Declaration["kind"];
  text: string;
  scope: string;
};

export const DeclarationsSidebar = ({ hoist }: { hoist: HoistType[] }) => {
  const { root, declarations } = useContext(DeclarationsContext);
  const exclude = new Set(hoist.map((hoisted) => hoisted.kind));

  return (
    <SidebarWrapper>
      {hoist.map((hoisted) => (
        <SidebarElement key={hoisted.text} icon={hoisted.icon} text={hoisted.text} to={`${root}/${hoisted.scope}`} />
      ))}
      {declarations
        .filter((declaration) => !exclude.has(declaration.kind))
        .map((declaration) => (
          <DeclarationSidebarElement key={declaration.name} declaration={declaration}></DeclarationSidebarElement>
        ))}
    </SidebarWrapper>
  );
};
