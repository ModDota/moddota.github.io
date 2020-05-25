import React from "react";

export function YouTube({ id, aspectRatio = 16 / 9 }: { id: string; aspectRatio: number }) {
    return (
        <div style={{ position: "relative", paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
            <iframe
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allowFullScreen={false}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
            />
        </div>
    );
}
