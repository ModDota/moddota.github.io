import React from "react";

export function Gfycat({ id, aspectRatio = 4 / 3 }: { id: string; aspectRatio: number }) {
    return (
        <p style={{ position: "relative", paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
            <iframe
                src={`https://gfycat.com/ifr/${id}`}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
            />
        </p>
    );
}
