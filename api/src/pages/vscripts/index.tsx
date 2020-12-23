import { allData } from 'dota-data/lib/helpers/vscripts';
import React from 'react';
import { HashScrollHandler } from '~components/ElementLink';
import { SidebarElement, SidebarWrapper } from '~components/layout/Sidebar';
import { Content } from './Content';

const Sidebar = () => (
  <SidebarWrapper>
    <SidebarElement icon="function" text="Functions" to="/vscripts/functions" />
    <SidebarElement icon="constant" text="Constants" to="/vscripts/constants" />
    {allData
      .filter((x) => x.kind === 'class' || x.kind === 'enum')
      .map(({ name, kind }) => (
        <SidebarElement key={name} icon={kind} text={name} to={`/vscripts/${name}`} />
      ))}
  </SidebarWrapper>
);

export default function VScriptsPage() {
  return (
    <>
      <HashScrollHandler />
      <Sidebar />
      <Content />
    </>
  );
}
