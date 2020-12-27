import React, { useLayoutEffect } from "react";
import { Link, useLocation } from "@docusaurus/router";
import styled from "styled-components";

export function HashScrollHandler() {
  const { hash } = useLocation();
  useLayoutEffect(() => {
    if (hash === "" || hash === "#") return;
    document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return null;
}

export function useLinkedElement(root: string, { scope, hash }: { scope?: string; hash?: string }) {
  const urlHash = hash ? `#${hash}` : "";
  const location = useLocation();
  return scope !== undefined && location.pathname === `${root}/${scope}` && location.hash === urlHash;
}

export function ElementLink({ root, scope, hash }: { root: string; scope: string; hash?: string }) {
  const urlHash = hash ? `#${hash}` : "";
  return (
    <StyledElementLink to={`${root}/${scope}${urlHash}`} title="Link">
      #
    </StyledElementLink>
  );
}

const StyledElementLink = styled(Link)`
  margin-right: 2px;
  font-size: 24px;
  line-height: 1;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
`;
