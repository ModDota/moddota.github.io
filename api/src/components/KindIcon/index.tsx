import React from 'react';
import Class from './Class.svg';
import EnumItem from './EnumItem.svg';
import Field from './Field.svg';
import Interface from './Interface.svg';
import Method from './Method.svg';

// https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export type IconKind = 'class' | 'enum' | 'constant' | 'field' | 'interface' | 'function';
const iconToElementMap: Record<IconKind, typeof import('*.svg').default> = {
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
  size: 'small' | 'big';
}> = React.memo(({ className, kind, size }) => {
  const sizes = size === 'small' ? 16 : 24;
  const Element = iconToElementMap[kind];
  return <Element className={className} width={sizes} height={sizes} />;
});
