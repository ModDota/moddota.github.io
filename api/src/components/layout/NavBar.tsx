import { darken } from "polished";
import React from "react";
import styled from "styled-components";
import ToggleButton from "react-toggle-button";
import { NavLink } from "react-router-dom";
import { AppContext } from "~components/AppContext";
import ModDotaLogo from "~components/ModDota.svg";

export const NavBar = () => (
  <NavBarWrapper>
    <HomeBrandLink href="/">
      <ModDotaLogo height="32" width="36" />
      <span>ModDota</span>
    </HomeBrandLink>
    <NavBarLink to="/vscripts">Lua API</NavBarLink>
    <NavBarLink to="/events">Game Events</NavBarLink>
    <NavBarRight>
      <NavBarThemeSwitcher />
    </NavBarRight>
  </NavBarWrapper>
);

const HomeBrandLink = styled.a`
  display: flex;
  align-items: center;
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.theme.text};
  text-shadow: 1px 1px 2px ${(props) => props.theme.navbarLinkShadow};
  padding: 0 20px;

  &.active {
    color: ${(props) => props.theme.highlight};
  }
  svg {
    margin-right: 8px;
  }

  @media (max-width: 500px) {
    span {
      display: none;
    }
  }
`;

const NavBarWrapper = styled.nav`
  display: flex;
  background-color: ${(props) => props.theme.navbar};
  border-bottom: 1px solid ${(props) => props.theme.navbarShadow};
  box-shadow: 0 0 4px ${(props) => props.theme.navbarShadow};
  margin-bottom: 8px;
`;

const NavBarRight = styled.div`
  display: flex;
  flex: auto;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12px;
`;

const NavBarLink = styled(NavLink)`
  padding: 12px 20px;
  font-weight: 600;
  text-decoration: none;

  color: ${(props) => darken(0.2, props.theme.text)};
  text-shadow: 1px 1px 2px ${(props) => props.theme.navbarLinkShadow};

  &.active {
    color: ${(props) => props.theme.highlight};
  }
`;

function NavBarThemeSwitcher() {
  const appContext = React.useContext(AppContext);

  return (
    <ToggleButton
      inactiveLabel="🌞"
      activeLabel="🌜"
      colors={{
        active: {
          base: "#101010",
        },
        inactive: {
          base: "#c0c0c0",
        },
        activeThumb: {
          base: "#606060",
        },
        inactiveThumb: {
          base: "#ffffff",
        },
      }}
      activeLabelStyle={{
        fontSize: "18px",
      }}
      inactiveLabelStyle={{
        fontSize: "18px",
      }}
      trackStyle={{
        height: "24px",
      }}
      thumbStyle={{
        width: "24px",
        height: "24px",
        borderWidth: "3px",
      }}
      passThroughInputProps={{
        "aria-label": "Dark Mode Toggle",
      }}
      value={appContext.darkmode}
      onToggle={(v) => appContext.setDarkmode(!v)}
    />
  );
}
