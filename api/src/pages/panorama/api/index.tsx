import React from "react";
import { scopes } from "../../data";
import DeclarationsPage from "../../DeclarationsPage";

export default function PanoramaApiPage() {
  return <DeclarationsPage context={scopes.panorama} hoist={[]}></DeclarationsPage>;
}
