import React from 'react';
import styled from 'styled-components';
import { HashScrollHandler } from '~components/ElementLink';
import { SidebarElement, SidebarWrapper } from '~components/layout/Sidebar';
import { Content } from './Content';
import { events } from './data';
import { EventStar } from './utils';

const SidebarElementStar = styled(EventStar)`
  float: right;
`;

const Sidebar = () => (
  <SidebarWrapper>
    {events.map((event) => (
      <SidebarElement
        key={event.name}
        to={`/events/${event.name}`}
        icon="interface"
        text={event.name}
        textSeparator="_"
        extra={event.isStarred && <SidebarElementStar />}
      />
    ))}
  </SidebarWrapper>
);

export default function EventsPage() {
  return (
    <>
      <HashScrollHandler />
      <Sidebar />
      <Content />
    </>
  );
}
