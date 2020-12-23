import React from 'react';
import styled from 'styled-components';
import { colors } from '~utils/constants';
import { KindIcon } from '../vscripts/elements/utils/components';
import {
  CommonGroupHeader,
  CommonGroupMembers,
  CommonGroupSignature,
  CommonGroupWrapper,
  ElementBadges,
  OptionalDescription,
} from '../vscripts/elements/utils/styles';
import * as data from './data';
import { EventField } from './EventField';
import { ElementLink, EventStar } from './utils';

const EventHeader = styled(CommonGroupHeader)`
  padding: 4px;
`;

const EventName = styled.span`
  font-weight: 700;
`;

const EventDescription = styled(OptionalDescription)`
  font-size: 18px;
  margin: 5px 20px;
`;

const EventSourceFileWrapper = styled.a`
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 4px;

  border-radius: 5px;
  background-color: rgb(37, 134, 224);
  text-decoration: none;
  color: ${colors.text};
`;

function EventSourceFile({ sourceFile }: { sourceFile: string }) {
  const addon = sourceFile === 'core' ? 'core' : 'dota';
  const url = `https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/${addon}/pak01_dir/resource/${sourceFile}.gameevents`;
  return (
    <EventSourceFileWrapper
      href={url}
      target="_blank"
      rel="noopener"
      title={`Defined in ${sourceFile}.gameevents`}
    >
      {sourceFile}
    </EventSourceFileWrapper>
  );
}

export function Event({ event }: { event: data.Event }) {
  return (
    <CommonGroupWrapper>
      <EventHeader>
        <CommonGroupSignature>
          <KindIcon kind="interface" size="big" />
          <EventName>{event.name}</EventName>
        </CommonGroupSignature>

        <ElementBadges>
          {event.isStarred && <EventStar />}
          <EventSourceFile sourceFile={event.sourceFile} />
          <ElementLink scope={event.name} />
        </ElementBadges>
      </EventHeader>
      <EventDescription description={event.description} />
      {event.fields.length > 0 && (
        <CommonGroupMembers>
          {event.fields.map((field) => (
            <EventField key={field.name} field={field} context={event.name} />
          ))}
        </CommonGroupMembers>
      )}
    </CommonGroupWrapper>
  );
}
