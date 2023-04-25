import { darken } from "polished";
import React, { useContext } from "react";
import styled from "styled-components";
import { ElementLink as RawElementLink, useLinkedElement as useLinkedElementRaw } from "~components/ElementLink";
import { KindIcon as UnstyledKindIcon } from "~components/KindIcon";
import SearchGitHubIcon from "./search-github.svg";
import SearchGoogleIcon from "./search-google.svg";
import { DeclarationsContext } from "~components/Docs/DeclarationsContext";

export function useLinkedElement(options: { scope?: string; hash?: string }) {
  const { root } = useContext(DeclarationsContext);
  return useLinkedElementRaw(root, options);
}

export function ElementLink({ scope, hash }: { scope: string; hash?: string }) {
  const { root } = useContext(DeclarationsContext);
  return <RawElementLink root={root} scope={scope} hash={hash} />;
}

export const KindIcon = styled(UnstyledKindIcon)`
  margin-bottom: -4px;
  margin-right: 4px;
`;

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
  const query = encodeURIComponent(`${name} path:vscripts`);
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
