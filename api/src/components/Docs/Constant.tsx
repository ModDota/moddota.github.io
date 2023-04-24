import * as api from "~components/Docs/api";
import React from "react";
import styled from "styled-components";
import { ElementLink, KindIcon, useLinkedElement } from "./utils/components";
import {
  CommonGroupHeader,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from "./utils/styles";

const ConstantWrapper = styled(CommonGroupWrapper)`
  padding: 5px;
`;

const ConstantSignature = styled(CommonGroupSignature)`
  font-size: 20px;
`;

export function Constant({
  className,
  style,
  element,
}: {
  className?: string;
  style?: React.CSSProperties;
  element: api.Constant;
}) {
  const isLinked = useLinkedElement({ scope: "constants", hash: element.name });
  return (
    <ConstantWrapper className={className} style={style} id={element.name} isLinked={isLinked}>
      <CommonGroupHeader>
        <ConstantSignature>
          <KindIcon kind="constant" size="medium" />
          {element.name}:&nbsp;{element.value}
        </ConstantSignature>
        <ElementBadges>
          <ElementLink scope="constants" hash={element.name} />
        </ElementBadges>
      </CommonGroupHeader>
      <OptionalDescription description={element.description} />
    </ConstantWrapper>
  );
}
