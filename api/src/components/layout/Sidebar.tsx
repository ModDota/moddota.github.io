import { darken } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { IconKind, KindIcon } from "~components/KindIcon";
import { intersperseWith } from "~utils/types";

const SidebarLink = styled(NavLink)`
  background: ${(props) => props.theme.sidebar};
  border-bottom: 3px solid transparent;
  border-radius: 3px;
  padding: 2px 2px 0 2px;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  word-break: break-all;

  :not(:last-child) {
    margin-bottom: 3px;
  }

  &:hover {
    background: ${(props) => darken(0.09, props.theme.sidebar)};
  }

  &.active {
    font-weight: 600;
    background: ${(props) => darken(0.09, props.theme.sidebar)};
    border-bottom: 3px solid ${(props) => props.theme.highlight};
  }
`;

const SidebarKindIcon = styled(KindIcon)`
  vertical-align: ${({ kind }) => (kind === "interface" ? "middle" : "baseline")};
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
    <SidebarKindIcon kind={icon} size="small" />{" "}
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
  padding: 2px 12px;

  @media (max-width: 1100px) {
    width: 200px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
