import React from "react";
import { DefaultTheme, useTheme } from "styled-components";
import { Theme } from "~components/Themes";

export type ColoredSyntaxKind = keyof Theme["syntax"];

export const getSyntaxColorFor = (theme: DefaultTheme, kind: ColoredSyntaxKind) => theme.syntax[kind];

export function ColoredSyntax({ kind, children }: { kind: ColoredSyntaxKind; children: React.ReactNode }) {
  const theme = useTheme();
  return <span style={{ color: getSyntaxColorFor(theme, kind) }}>{children}</span>;
}
