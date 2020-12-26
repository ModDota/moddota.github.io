import React from "react";
import styled, { css } from "styled-components";
import { lighten, mix } from "polished";

export const CommonGroupWrapper = styled.div<{ isLinked?: boolean }>`
  display: flex;
  flex-flow: column;
  background-color: ${(props) => props.theme.group};
  border: 1px solid ${(props) => props.theme.groupBorder};
  border-top-color: ${(props) => lighten(0.1, props.theme.groupBorder)};
  border-radius: 4px;
  box-shadow: 2px 2px 6px ${(props) => props.theme.groupShadow};
  padding: 1px;
  word-break: break-all;

  ${(props) =>
    props.isLinked &&
    css`
      border: 3px solid ${props.theme.highlight};
      box-shadow: 2px 2px 12px ${props.theme.groupShadow};
      background: linear-gradient(
        to right,
        ${mix(0.15, props.theme.highlight, props.theme.group)},
        ${props.theme.group}
      );
    `}
`;

export const CommonGroupMembers = styled.div`
  background-color: ${(props) => props.theme.groupMembers};
  padding: 8px 8px 8px 30px;

  > :not(:last-child) {
    margin-bottom: 3px;
  }
`;

export const CommonGroupHeader = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CommonGroupSignature = styled.div`
  flex: 1;
  font-weight: 600;
`;

const Description = styled.div`
  margin: 4px 0 0 28px;
  padding: 6px 0;
  border-top: 1px solid ${(props) => props.theme.groupSeparator};
`;

export const OptionalDescription: React.FC<{
  className?: string;
  description?: React.ReactNode;
}> = ({ className, description }) => (
  <>{description && <Description className={className}>{description}</Description>}</>
);

export const ElementBadges = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  > * {
    margin-left: 5px;
  }

  @media (max-width: 768px) {
    > :first-child {
      margin-left: 0;
    }
  }
`;
