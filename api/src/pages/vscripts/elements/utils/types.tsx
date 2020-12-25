import api from "@moddota/dota-data/files/vscripts/api";
import { findTypeByName } from "@moddota/dota-data/lib/helpers/vscripts";
import React, { useMemo, useContext } from "react";
import { NavLink } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import invariant from "tiny-invariant";
import { ColoredSyntax, ColoredSyntaxKind, getSyntaxColorFor } from "~components/ColoredSyntax";
import { assertNever, intersperse } from "~utils/types";

export const Types: React.FC<{ types: api.Type[] }> = ({ types }) => (
  <>
    {intersperse(
      types.map((type, index) => <Type key={index} type={type} />),
      " | ",
    )}
  </>
);

const Type: React.FC<{ type: api.Type }> = ({ type }) => {
  if (typeof type === "string") return <ReferenceType name={type} />;
  switch (type.kind) {
    case "array":
      return <ArrayType type={type} />;
    case "function":
      return <FunctionType type={type} />;
    case "literal":
      return <LiteralType type={type} />;
    case "table":
      return <TableType type={type} />;
    default:
      assertNever(type);
  }
};

const TypeReferenceLink = styled(NavLink)`
  font-weight: 600;

  &.active {
    text-decoration: none;
  }
`;

const TypeSpan = styled.span`
  font-weight: 600;
`;

const ReferenceType: React.FC<{ name: string }> = ({ name }) => {
  const [kind, scope, hash] = useMemo((): [ColoredSyntaxKind, string?, string?] => {
    if (name === "nil") return ["nil"];

    const type = findTypeByName(name);
    invariant(type !== undefined, `Invalid type reference: ${name}`);
    if (type.kind === "primitive" || type.kind === "nominal") {
      return ["literal"];
    }

    return [
      "interface",
      type.kind === "class" || type.kind === "enum"
        ? name
        : type.kind === "constant"
        ? "constants"
        : type.kind === "function"
        ? "functions"
        : undefined,
      type.kind === "constant" || type.kind === "function" ? name : undefined,
    ];
  }, [name]);

  const urlHash = hash ? `#${hash}` : "";
  const style: React.CSSProperties = { textDecorationColor: getSyntaxColorFor(useContext(ThemeContext), kind) };

  return scope ? (
    <TypeReferenceLink to={`/vscripts/${scope}${urlHash}`} style={style}>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </TypeReferenceLink>
  ) : (
    <TypeSpan>
      <ColoredSyntax kind={kind}>{name}</ColoredSyntax>
    </TypeSpan>
  );
};

const LiteralType: React.FC<{ type: api.LiteralType }> = ({ type: { value } }) => (
  <TypeSpan>
    <ColoredSyntax kind="literal">{value}</ColoredSyntax>
  </TypeSpan>
);

const ArrayType: React.FC<{ type: api.ArrayType }> = ({ type: { types } }) => (
  <TypeSpan>
    [<Types types={types} />]
  </TypeSpan>
);

const TableType: React.FC<{ type: api.TableType }> = ({ type: { key, value } }) => (
  <TypeSpan>
    {"{"} [
    <Types types={key} />
    ]: <Types types={value} /> {"}"}
  </TypeSpan>
);

const FunctionType: React.FC<{ type: api.FunctionType }> = ({ type: { args, returns } }) => (
  <TypeSpan>
    <FunctionParameters args={args} /> → <Types types={returns} />
  </TypeSpan>
);

export function FunctionParameters({ args }: { args: api.FunctionParameter[] }) {
  return (
    <>
      (
      {intersperse(
        args.map((arg) => <FunctionParameter key={arg.name} {...arg} />),
        ", ",
      )}
      )
    </>
  );
}

const FunctionParameterWrapper = styled.span`
  font-weight: normal;
`;

const FunctionParameter: React.FC<{ name: string; types: api.Type[] }> = ({ name, types }) => (
  <FunctionParameterWrapper>
    <ColoredSyntax kind="parameter">{name}</ColoredSyntax>:&nbsp;
    <Types types={types} />
  </FunctionParameterWrapper>
);
