import * as api from "./api";
import apiTypes from "@moddota/dota-data/files/vscripts/api-types";
import React from "react";
import styled from "styled-components";
import { ElementLink, KindIcon, useLinkedElement } from "./utils/components";
import { CommonGroupHeader, CommonGroupSignature, CommonGroupWrapper, ElementBadges } from "./utils/styles";
import { Types } from "./types";

const FieldWrapper = styled(CommonGroupWrapper)`
  padding: 4px;
`;

const FieldSignature = styled(CommonGroupSignature)``;

export const Field: React.FC<{
  className?: string;
  context?: string;
  element: api.Field | apiTypes.ObjectField;
}> = ({ className, context, element }) => {
  const isLinked = useLinkedElement({ scope: context, hash: element.name });
  return (
    <FieldWrapper className={className} id={element.name} isLinked={isLinked}>
      <CommonGroupHeader>
        <FieldSignature>
          <KindIcon kind="field" size="small" />
          {element.name}
          {element.types.includes("nil") && "?"}: {<Types types={element.types.filter((x) => x !== "nil")} />}
        </FieldSignature>
        <ElementBadges>{context && <ElementLink scope={context} hash={element.name} />}</ElementBadges>
      </CommonGroupHeader>
    </FieldWrapper>
  );
};
