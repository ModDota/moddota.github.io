import { darken } from 'polished';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { IconKind, KindIcon } from '~components/KindIcon';
import { colors } from '~utils/constants';
import { intersperseWith } from '~utils/types';

const SidebarLink = styled(NavLink)`
  padding: 2px;
  border: 1px solid black;
  background-color: ${colors.mainLight};
  text-decoration: none;
  color: ${colors.text};

  :not(:last-child) {
    margin-bottom: 3px;
  }

  &:hover {
    background-color: ${darken(0.09, colors.mainLight)};
  }

  &.active {
    background-color: ${darken(0.16, colors.mainLight)};
  }
`;

const SidebarKindIcon = styled(KindIcon)`
  vertical-align: ${({ kind }) => (kind === 'interface' ? 'middle' : 'baseline')};
`;

const insertWordBreaks = (text: string, separator: string) => (
  <>{intersperseWith(text.split(separator), (index) => [separator, <wbr key={index} />])}</>
);

export const SidebarElement: React.FC<{
  to: string;
  icon: IconKind;
  text: string;
  textSeparator?: string;
  extra?: React.ReactNode;
}> = React.memo(({ to, icon, text, textSeparator, extra }) => (
  <SidebarLink to={to}>
    <SidebarKindIcon kind={icon} size="small" />{' '}
    {textSeparator !== undefined ? insertWordBreaks(text, textSeparator) : text}
    {extra}
  </SidebarLink>
));

export const SidebarWrapper = styled.div`
  width: 340px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  overflow-y: scroll;
  padding: 4px 6px;
`;
