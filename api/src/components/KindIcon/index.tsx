import React from "react";
import Class from "./Class.svg?react";
import EnumItem from "./EnumItem.svg?react";
import Field from "./Field.svg?react";
import Interface from "./Interface.svg?react";
import Method from "./Method.svg?react";

// https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export type IconKind = "class" | "enum" | "constant" | "field" | "interface" | "function";
const iconToElementMap: Record<IconKind, typeof Class> = {
  class: Class,
  enum: EnumItem,
  constant: EnumItem,
  field: Field,
  interface: Interface,
  function: Method,
};

export const KindIcon: React.FC<{
  className?: string;
  kind: IconKind;
  size: "small" | "medium" | "big";
}> = React.memo(({ className, kind, size }) => {
  const sizes = size === "small" ? 16 : size === "medium" ? 20 : 24;
  const Element = iconToElementMap[kind];
  return <Element className={className} width={sizes} height={sizes} />;
});
