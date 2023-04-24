import React from "react";
import { scopes } from "../data";
import DeclarationsPage from "../DeclarationsPage";

export default function EventsPage() {
  return <DeclarationsPage context={scopes.vscriptsEvents} hoist={[]}></DeclarationsPage>;
}
