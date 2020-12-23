import api from 'dota-data/files/vscripts/enums';
import React from 'react';
import styled from 'styled-components';
import { ColoredSyntax } from '~components/ColoredSyntax';
import { ElementLink, KindIcon, ReferencesLink } from './utils/components';
import {
  CommonGroupHeader,
  CommonGroupMembers,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from './utils/styles';

const EnumMemberWrapper = styled(CommonGroupWrapper)`
  padding: 2px 5px;
`;

const EnumMember: React.FC<api.EnumMember> = (props) => (
  <EnumMemberWrapper>
    <CommonGroupHeader>
      <CommonGroupSignature>
        {props.name} = <ColoredSyntax kind="literal">{props.value}</ColoredSyntax>
      </CommonGroupSignature>
    </CommonGroupHeader>
    <OptionalDescription description={props.description} />
  </EnumMemberWrapper>
);

const EnumHeader = styled(CommonGroupHeader)`
  padding: 5px;
`;

const EnumMembers = styled(CommonGroupMembers)`
  > :not(:last-child) {
    margin-bottom: 2px;
  }
`;

export const Enum: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  element: api.Enum;
}> = ({ className, style, element }) => (
  <CommonGroupWrapper className={className} style={style}>
    <EnumHeader>
      <CommonGroupSignature>
        <KindIcon kind="enum" size="big" />
        {element.name}
      </CommonGroupSignature>
      <ElementBadges>
        <ReferencesLink name={element.name} />
        <ElementLink scope={element.name} />
      </ElementBadges>
    </EnumHeader>
    <OptionalDescription description={element.description} />
    {element.members.length > 0 && (
      <EnumMembers>
        {element.members.map((member) => (
          <EnumMember key={member.name} {...member} />
        ))}
      </EnumMembers>
    )}
  </CommonGroupWrapper>
);
