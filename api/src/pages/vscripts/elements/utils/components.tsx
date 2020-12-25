import { Availability } from "@moddota/dota-data/files/vscripts/api";
import { darken } from "polished";
import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { ElementLink as RawElementLink, useLinkedElement as useLinkedElementRaw } from "~components/ElementLink";
import { KindIcon as UnstyledKindIcon } from "~components/KindIcon";
import { doSearch } from "../../data";
import SearchGitHubIcon from "./search-github.svg";
import SearchGoogleIcon from "./search-google.svg";

export const useLinkedElement = useLinkedElementRaw.bind(undefined, "/vscripts");
export function ElementLink({ scope, hash }: { scope: string; hash?: string }) {
  return <RawElementLink root="/vscripts" scope={scope} hash={hash} />;
}

export const KindIcon = styled(UnstyledKindIcon)`
  margin-bottom: -4px;
  margin-right: 4px;
`;

const AvailabilityBadgeBox = styled.div<{ color: string; active: boolean }>`
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1;
  width: 20px;
  height: 20px;
  text-align: center;
  user-select: none;
  background: radial-gradient(${(props) => props.color}, ${(props) => darken(0.22, props.color)});
  color: white;
  border-radius: 3px;
  font-weight: bold;
  text-shadow: 1px 1px 1px black;
  box-shadow: 1px 1px 1px #00000030;

  ${(props) =>
    !props.active &&
    css`
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
      filter: saturate(10%);
      opacity: 40%;
    `}
`;

export const AvailabilityBadge: React.FC<{ available: Availability }> = ({ available }) => {
  const onServer = available === "server" || available === "both";
  const onClient = available === "client" || available === "both";
  return (
    <>
      <AvailabilityBadgeBox
        color="#5b82ee"
        active={onServer}
        title={`${onServer ? "Available" : "Unavailable"} on server-side Lua`}
      >
        s
      </AvailabilityBadgeBox>
      <AvailabilityBadgeBox
        color="#59df37"
        active={onClient}
        title={`${onClient ? "Available" : "Unavailable"} on client-side Lua`}
      >
        c
      </AvailabilityBadgeBox>
    </>
  );
};

const SearchWrapper = styled.a.attrs({ target: "_blank", rel: "noreferrer noopener" })`
  display: block;
  border-radius: 3px;
  background-color: ${darken(0.1, "white")};
  line-height: 1;
  width: 20px;
  height: 20px;
  box-shadow: 1px 1px 1px #00000030;

  > * {
    margin: 2px;
  }
`;

export const SearchOnGitHub: React.FC<{ name: string }> = ({ name }) => {
  const query = encodeURIComponent(`vscripts in:path ${name} in:file`);
  const href = `https://github.com/search?l=Lua&q=${query}&type=Code`;
  return (
    <SearchWrapper href={href} title="Search on GitHub">
      <SearchGitHubIcon width={16} height={16} />
    </SearchWrapper>
  );
};

export const SearchOnGoogle: React.FC<{ name: string }> = ({ name }) => {
  const query = encodeURIComponent(`site:github.com inurl:vscripts "${name}"`);
  const href = `https://www.google.com/search?q=${query}`;
  return (
    <SearchWrapper href={href} title="Search on Google">
      <SearchGoogleIcon width={16} height={16} />
    </SearchWrapper>
  );
};

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
  const referencesCount = useMemo(() => {
    const references = doSearch([`type:${name.toLowerCase()}`]);
    return references.reduce(
      (n, e) => n + (e.kind === "class" ? e.members.length + (e.extend === name ? 1 : 0) : 1),
      0,
    );
  }, [name]);

  return (
    <StyledReferencesLink
      to={`/vscripts${search}`}
      isActive={(_, location) => location.pathname === "/vscripts" && location.search === search}
      title="Find all usages of this API"
    >
      {referencesCount} reference{referencesCount === 1 ? "" : "s"}
    </StyledReferencesLink>
  );
};
