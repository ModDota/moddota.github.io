import api from "@moddota/dota-data/files/vscripts/api";
import React from "react";
import styled from "styled-components";
import { Field } from "./Field";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { AvailabilityBadge, ElementLink, KindIcon, ReferencesLink } from "./utils/components";
import {
  CommonGroupHeader,
  CommonGroupMembers,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from "./utils/styles";
import { Types } from "./utils/types";

const ClassWrapper = styled(CommonGroupWrapper)``;

const ClassHeader = styled(CommonGroupHeader)`
  padding: 5px;
`;

const ClassName = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const ClassExtendsWrapper = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: ${(props) => props.theme.textDim};

  @media (max-width: 768px) {
    display: block;
  }
`;

const ClassExtends: React.FC<{ extend: string }> = ({ extend }) => (
  <ClassExtendsWrapper>
    extends <Types types={[extend]} />
  </ClassExtendsWrapper>
);

const ClassMembers = styled(CommonGroupMembers)`
  padding: 8px;

  > :not(:last-child) {
    margin-bottom: 14px;
  }
`;

export const ClassDeclaration: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  declaration: api.ClassDeclaration;
}> = ({ className, style, declaration }) => (
  <ClassWrapper className={className} style={style}>
    <ClassHeader>
      <CommonGroupSignature>
        <KindIcon kind="class" size="big" />
        <ClassName>{declaration.name}</ClassName>
        &nbsp;
        {declaration.extend && <ClassExtends extend={declaration.extend} />}
      </CommonGroupSignature>
      <ElementBadges>
        <ReferencesLink name={declaration.name} />
        <AvailabilityBadge available={declaration.clientName != null ? "both" : "server"} />
        <ElementLink scope={declaration.name} />
      </ElementBadges>
    </ClassHeader>
    <OptionalDescription description={declaration.description} />
    {declaration.members.length > 0 && (
      <ClassMembers>
        {declaration.members.map((member) =>
          member.kind === "field" ? (
            <Field key={member.name} element={member} context={declaration.name} />
          ) : (
            <FunctionDeclaration key={member.name} declaration={member} context={declaration.name} />
          ),
        )}
      </ClassMembers>
    )}
  </ClassWrapper>
);
