import React from "react";

export function Star({ className }: { className?: string }) {
  return (
    <span className={className} title="This event is useful for custom games">
      ⭐
    </span>
  );
}
