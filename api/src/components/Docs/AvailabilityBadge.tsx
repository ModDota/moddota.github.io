import React from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { Availability } from "~components/Docs/api";

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
