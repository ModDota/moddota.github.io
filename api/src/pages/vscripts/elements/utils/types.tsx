import arrowIconUrl from '!!file-loader!./arrow.svg';
import api from 'dota-data/files/vscripts/api';
import { findTypeByName } from 'dota-data/lib/helpers/vscripts';
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import invariant from 'tiny-invariant';
import { ColoredSyntax, ColoredSyntaxKind, getSyntaxColorFor } from '~components/ColoredSyntax';
import { assertNever, intersperse } from '~utils/types';

export const Types: React.FC<{ types: api.Type[] }> = ({ types }) => (
  <>
    {intersperse(
      types.map((type, index) => <Type key={index} type={type} />),
      ' | ',
    )}
  </>
);

const Type: React.FC<{ type: api.Type }> = ({ type }) => {
  if (typeof type === 'string') return <ReferenceType name={type} />;
  switch (type.kind) {
    case 'array':
      return <ArrayType type={type} />;
    case 'function':
      return <FunctionType type={type} />;
    case 'literal':
      return <LiteralType type={type} />;
    case 'table':
      return <TableType type={type} />;
    default:
      assertNever(type);
  }
};

const TypeReferenceLink = styled(NavLink)`
  &.active {
    text-decoration: none;
  }
`;

const ReferenceType: React.FC<{ name: string }> = ({ name }) => {
  const [kind, scope, hash] = useMemo((): [ColoredSyntaxKind, string?, string?] => {
    if (name === 'nil') return ['nil'];

    const type = findTypeByName(name);
    invariant(type !== undefined, `Invalid type reference: ${name}`);
    if (type.kind === 'primitive' || type.kind === 'nominal') {
      return ['literal'];
    }

    return [
      'interface',
      type.kind === 'class' || type.kind === 'enum'
        ? name
        : type.kind === 'constant'
        ? 'constants'
        : type.kind === 'function'
        ? 'functions'
        : undefined,
      type.kind === 'constant' || type.kind === 'function' ? name : undefined,
    ];
  }, [name]);

  const urlHash = hash ? `#${hash}` : '';
  const style: React.CSSProperties = { textDecorationColor: getSyntaxColorFor(kind) };
  return scope ? (
    <TypeReferenceLink to={`/vscripts/${scope}${urlHash}`} style={style}>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </TypeReferenceLink>
  ) : (
    <span style={style}>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </span>
  );
};

const LiteralType: React.FC<{ type: api.LiteralType }> = ({ type: { value } }) => (
  <span>
    <ColoredSyntax kind="literal">{value}</ColoredSyntax>
  </span>
);

const ArrayType: React.FC<{ type: api.ArrayType }> = ({ type: { types } }) => (
  <span>
    [<Types types={types} />]
  </span>
);

const TableType: React.FC<{ type: api.TableType }> = ({ type: { key, value } }) => (
  <span>
    {'{'} [
    <Types types={key} />
    ]: <Types types={value} /> {'}'}
  </span>
);

const FunctionType: React.FC<{ type: api.FunctionType }> = ({ type: { args, returns } }) => (
  <span>
    <FunctionParameters args={args} />
    <ArrowIcon />
    <Types types={returns} />
  </span>
);

export function FunctionParameters({ args }: { args: api.FunctionParameter[] }) {
  return (
    <>
      (
      {intersperse(
        args.map((arg) => <FunctionParameter key={arg.name} {...arg} />),
        ', ',
      )}
      )
    </>
  );
}

const FunctionParameter: React.FC<{ name: string; types: api.Type[] }> = ({ name, types }) => (
  <span>
    <ColoredSyntax kind="parameter">{name}</ColoredSyntax>:&nbsp;
    <Types types={types} />
  </span>
);

const ArrowIconWrapper = styled.span`
  /* Using spaces instead of margin to include spaces in copied text */
  word-spacing: -1px;
`;

const ArrowIcon = () => (
  <ArrowIconWrapper>
    {' '}
    <img src={arrowIconUrl} height={14} alt="=>" />{' '}
  </ArrowIconWrapper>
);
