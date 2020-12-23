import React from 'react';
import {
  ElementLink as RawElementLink,
  useLinkedElement as useLinkedElementRaw,
} from '~components/ElementLink';

export function EventStar({ className }: { className?: string }) {
  return (
    <span className={className} title="This event is useful for custom games">
      ⭐
    </span>
  );
}

export const useLinkedElement = useLinkedElementRaw.bind(undefined, '/events');
export function ElementLink({ scope, hash }: { scope: string; hash?: string }) {
  return <RawElementLink root="/events" scope={scope} hash={hash} />;
}
