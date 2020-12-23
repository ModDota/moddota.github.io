import React from 'react';
import styled from 'styled-components';
import { ColoredSyntax } from '~components/ColoredSyntax';
import { KindIcon } from '../vscripts/elements/utils/components';
import {
  CommonGroupHeader,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from '../vscripts/elements/utils/styles';
import * as data from './data';
import { ElementLink, useLinkedElement } from './utils';

const EventFieldWrapper = styled(CommonGroupWrapper)`
  padding: 4px;
`;

const EventFieldSignature = styled(CommonGroupSignature)`
  font-size: 20px;
`;

export function EventField({ field, context }: { field: data.EventField; context: string }) {
  const isLinked = useLinkedElement({ scope: context, hash: field.name });

  return (
    <EventFieldWrapper id={field.name} isLinked={isLinked}>
      <CommonGroupHeader>
        <EventFieldSignature>
          <KindIcon kind="field" size="big" />
          {field.name}: <ColoredSyntax kind="literal">{field.type}</ColoredSyntax>
        </EventFieldSignature>

        <ElementBadges>
          <ElementLink scope={context} hash={field.name} />
        </ElementBadges>
      </CommonGroupHeader>
      <OptionalDescription description={field.description} />
    </EventFieldWrapper>
  );
}
