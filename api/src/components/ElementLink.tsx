import React, { useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '~utils/constants';

export function HashScrollHandler() {
  const { hash } = useLocation();
  useLayoutEffect(() => {
    if (hash === '' || hash === '#') return;
    document.querySelector(hash)?.scrollIntoView();
  }, [hash]);

  return null;
}

export function useLinkedElement(root: string, { scope, hash }: { scope?: string; hash?: string }) {
  const urlHash = hash ? `#${hash}` : '';
  const location = useLocation();
  return (
    scope !== undefined && location.pathname === `${root}/${scope}` && location.hash === urlHash
  );
}

export function ElementLink({ root, scope, hash }: { root: string; scope: string; hash?: string }) {
  const urlHash = hash ? `#${hash}` : '';
  return (
    <StyledElementLink to={`${root}/${scope}${urlHash}`} title="Link">
      #
    </StyledElementLink>
  );
}

const StyledElementLink = styled(Link)`
  margin-right: 2px;
  font-size: 30px;
  line-height: 1;
  text-decoration: none;
  color: ${colors.text};
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
`;
