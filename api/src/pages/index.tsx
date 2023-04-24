import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";

const EventsPage = React.lazy(() => import(/* webpackChunkName: "events" */ "./events"));
const VScriptsPage = React.lazy(() => import(/* webpackChunkName: "vscripts" */ "./vscripts"));
const PanoramaApiPage = React.lazy(() => import(/* webpackChunkName: "panorama_events" */ "./panorama/api"));
const PanoramaEventsPage = React.lazy(() => import(/* webpackChunkName: "panorama_events" */ "./panorama/events"));

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
      <Route path="/panorama/api/:scope?" component={PanoramaApiPage} />
      <Route path="/panorama/events/:scope?" component={PanoramaEventsPage} />
      <Route>
        <ErrorPage>404 Not Found</ErrorPage>
      </Route>
    </Switch>
  );
}
