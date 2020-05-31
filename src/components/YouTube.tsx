import React from "react";

export function YouTube({
    id,
    playlistId,
    aspectRatio = 16 / 9,
}: {
    id?: string;
    playlistId?: string;
    aspectRatio: number;
}) {
    const embedUrl =
        playlistId !== undefined
            ? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
            : `https://www.youtube.com/embed/${id}`;

    return (
        <p style={{ position: "relative", paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
            <iframe
                src={embedUrl}
                frameBorder="0"
                allowFullScreen={true}
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0 }}
            />
        </p>
    );
}
