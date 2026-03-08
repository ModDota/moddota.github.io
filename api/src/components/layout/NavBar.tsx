import { darken } from "polished";
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AppContext } from "~components/AppContext";
import ModDotaLogo from "~components/ModDota.svg?react";

export const NavBar = () => (
  <NavBarWrapper>
    <HomeBrandLink href="/">
      <ModDotaLogo height="32" width="36" />
      <span>ModDota</span>
    </HomeBrandLink>
    <NavBarLink to="/vscripts">Lua API</NavBarLink>
    <NavBarLink to="/events">Game Events</NavBarLink>
    <NavBarLink to="/panorama/api">Panorama API</NavBarLink>
    <NavBarLink to="/panorama/events">Panorama Events</NavBarLink>
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

const ToggleTrack = styled.label<{ $active: boolean }>`
  display: flex;
  align-items: center;
  width: 52px;
  height: 24px;
  border-radius: 12px;
  background-color: ${(props) => (props.$active ? "#101010" : "#c0c0c0")};
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const ToggleThumb = styled.span<{ $active: boolean }>`
  position: absolute;
  left: ${(props) => (props.$active ? "26px" : "2px")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "#606060" : "#ffffff")};
  border: 2px solid ${(props) => (props.$active ? "#404040" : "#e0e0e0")};
  transition: left 0.2s, background-color 0.2s;
  box-sizing: border-box;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  user-select: none;
  position: absolute;
`;

const ToggleLabelLeft = styled(ToggleLabel)`
  left: 6px;
`;

const ToggleLabelRight = styled(ToggleLabel)`
  right: 6px;
`;

function NavBarThemeSwitcher() {
  const appContext = React.useContext(AppContext);

  return (
    <ToggleTrack $active={appContext.darkmode}>
      <input
        type="checkbox"
        checked={appContext.darkmode}
        onChange={(e) => appContext.setDarkmode(e.target.checked)}
        aria-label="Dark Mode Toggle"
      />
      <ToggleLabelLeft>{appContext.darkmode ? "🌜" : ""}</ToggleLabelLeft>
      <ToggleLabelRight>{appContext.darkmode ? "" : "🌞"}</ToggleLabelRight>
      <ToggleThumb $active={appContext.darkmode} />
    </ToggleTrack>
  );
}
