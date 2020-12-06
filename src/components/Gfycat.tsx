import React from "react";

export function Gfycat({ id, aspectRatio = 4 / 3, hd = "0" }: { id: string; aspectRatio: number; hd: "0" | "1" }) {
    return (
        <p style={{ position: "relative", paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
            <iframe
                src={`https://gfycat.com/ifr/${id}?hd=${hd}`}
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
