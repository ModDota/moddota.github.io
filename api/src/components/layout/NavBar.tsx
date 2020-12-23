import { darken } from 'polished';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '~utils/constants';

export const NavBar = () => (
  <NavBarWrapper>
    <NavBarLink to="/vscripts">Lua API</NavBarLink>
    <NavBarLink to="/events">Game Events</NavBarLink>
  </NavBarWrapper>
);

const NavBarWrapper = styled.nav`
  display: flex;
  background-color: ${colors.mainLight};
  border-bottom: 1px solid rgba(0, 0, 0, 0.7);
`;

const NavBarLink = styled(NavLink)`
  padding: 8px 10px;
  font-weight: 600;
  text-decoration: none;

  color: ${darken(0.2, colors.text)};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);

  &.active {
    color: ${colors.text};
    text-shadow: 1px 1px 2px black;
  }
`;
