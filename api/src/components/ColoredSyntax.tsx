import React, { useContext } from "react";
import { DefaultTheme, ThemeContext } from "styled-components";
import { Theme } from "./Themes";

export type ColoredSyntaxKind = keyof Theme["syntax"];

export const getSyntaxColorFor = (theme: DefaultTheme, kind: ColoredSyntaxKind) => theme.syntax[kind];

export function ColoredSyntax({ kind, children }: { kind: ColoredSyntaxKind; children: React.ReactChild }) {
  const theme = useContext(ThemeContext);
  return <span style={{ color: getSyntaxColorFor(theme, kind) }}>{children}</span>;
}
