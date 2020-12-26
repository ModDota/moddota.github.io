import React from "react";
import { Switch, Route, Redirect } from '@docusaurus/router'
import styled from "styled-components";

const EventsPage = React.lazy(() => import("../../api/src/pages/events"));
const VScriptsPage = React.lazy(() => import("../../api/src/pages/vscripts"));

const ErrorPage = styled.div`
  margin: auto;
  text-align: center;
  font-size: 24px;
`;

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/vscripts" />
      </Route>
      <Route path="/events/:scope?" component={EventsPage} />
      <Route path="/vscripts/:scope?" component={VScriptsPage} />
      <Route>
        <ErrorPage>404 Not Found</ErrorPage>
      </Route>
    </Switch>
  );
}
