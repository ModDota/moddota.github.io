import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { darken } from "polished";
import React, { useContext, useMemo } from "react";
import { doSearch } from "./utils/filtering";
import { DeclarationsContext } from "~components/Docs/DeclarationsContext";

const StyledReferencesLink = styled(NavLink)`
  margin-right: 4px;
  color: ${(props) => props.theme.text};
  font-size: 14px;
  &.active {
    text-decoration: none;
    color: ${(props) => darken(0.1, props.theme.text)};
    cursor: default;
  }
`;

export const ReferencesLink: React.FC<{ name: string }> = ({ name }) => {
  const search = `?search=${encodeURIComponent(`type:${name}`)}`;
  const { declarations } = useContext(DeclarationsContext);
  const location = useLocation();
  const referencesCount = useMemo(() => {
    const references = doSearch(declarations, [`type:${name.toLowerCase()}`]);
    return references.reduce(
      (n, e) => n + (e.kind === "class" ? e.members.length + (e.extend === name ? 1 : 0) : 1),
      0,
    );
  }, [name, declarations]);

  const isActive = location.pathname === "/vscripts" && location.search === search;

  return (
    <StyledReferencesLink
      to={`/vscripts${search}`}
      className={() => isActive ? "active" : ""}
      title="Find all usages of this API"
    >
      {referencesCount} reference{referencesCount === 1 ? "" : "s"}
    </StyledReferencesLink>
  );
};
