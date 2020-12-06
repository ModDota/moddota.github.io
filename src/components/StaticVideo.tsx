import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

export function StaticVideo({ path }: { path: string }) {
    return (
        <video width="100%" height="100%" autoPlay muted loop>
            <source src={useBaseUrl(path)} type="video/mp4"></source>
        </video>
    );
}
