import { darken } from 'polished';
import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '~utils/constants';

export const CommonGroupWrapper = styled.div<{ isLinked?: boolean }>`
  display: flex;
  flex-flow: column;
  border: 1px solid black;
  background-color: ${colors.mainLight};
  ${(props) =>
    props.isLinked &&
    css`
      background-color: ${darken(0.12, colors.mainLight)};
    `}
`;

export const CommonGroupMembers = styled.div`
  border-top: 1px solid black;
  background-color: ${colors.mainDark};
  padding: 8px;

  > :not(:last-child) {
    margin-bottom: 7px;
  }
`;

export const CommonGroupHeader = styled.div`
  display: flex;
`;

export const CommonGroupSignature = styled.div`
  flex: 1;
  font-size: 24px;
`;

const DescriptionSeparator = styled.hr`
  margin: 3px 10px;
  background-color: ${colors.lightest};
`;

export const OptionalDescription: React.FC<{
  className?: string;
  description?: React.ReactNode;
}> = ({ className, description }) => (
  <>
    {description && <DescriptionSeparator />}
    {description && <div className={className}>{description}</div>}
  </>
);

export const ElementBadges = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  > * {
    margin-left: 5px;
  }
`;
