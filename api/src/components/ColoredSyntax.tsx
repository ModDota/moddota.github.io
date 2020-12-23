import React from 'react';

export type ColoredSyntaxKind = keyof typeof coloredSyntaxColors;
const coloredSyntaxColors = {
  literal: '#74f2ca',
  interface: '#74f2ca',
  parameter: '#adebff',
  nil: '#ead0ff',
};

export const getSyntaxColorFor = (kind: ColoredSyntaxKind) => coloredSyntaxColors[kind];
export const ColoredSyntax: React.FC<{ kind: ColoredSyntaxKind }> = (props) => (
  <span style={{ color: getSyntaxColorFor(props.kind) }}>{props.children}</span>
);
