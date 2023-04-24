import React from "react";
import { scopes } from "../../data";
import DeclarationsPage from "../../DeclarationsPage";

export default function PanoramaEventsPage() {
  return <DeclarationsPage context={scopes.panoramaEvents} hoist={[]}></DeclarationsPage>;
}
