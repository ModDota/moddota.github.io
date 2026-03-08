import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";

const EventsPage = React.lazy(() => import("./events"));
const VScriptsPage = React.lazy(() => import("./vscripts"));
const PanoramaApiPage = React.lazy(() => import("./panorama/api"));
const PanoramaEventsPage = React.lazy(() => import("./panorama/events"));

const ErrorPage = styled.div`
  margin: auto;
  text-align: center;
  font-size: 24px;
`;

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vscripts" replace />} />
      <Route path="/events/:scope?" element={<EventsPage />} />
      <Route path="/vscripts/:scope?" element={<VScriptsPage />} />
      <Route path="/panorama/api/:scope?" element={<PanoramaApiPage />} />
      <Route path="/panorama/events/:scope?" element={<PanoramaEventsPage />} />
      <Route path="*" element={<ErrorPage>404 Not Found</ErrorPage>} />
    </Routes>
  );
}
