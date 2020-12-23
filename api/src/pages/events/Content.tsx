import React from 'react';
import { ContentWrapper, ListItem, StyledSearchBox, TextMessage } from '~components/layout/Content';
import { LazyList, ScrollableList } from '~components/Lists';
import * as data from './data';
import { Event } from './Event';

const renderItem = (event: data.Event, style?: React.CSSProperties) => (
  <ListItem style={style} key={event.name}>
    <Event event={event} />
  </ListItem>
);

export function Content() {
  const { data: content, isSearching } = data.useFilteredData();

  return (
    <ContentWrapper>
      <StyledSearchBox baseUrl="/events" />

      {content.length > 0 ? (
        isSearching ? (
          <LazyList data={content} render={renderItem} />
        ) : (
          <ScrollableList data={content} render={renderItem} />
        )
      ) : isSearching ? (
        <TextMessage>No results found</TextMessage>
      ) : (
        <TextMessage>Select an event or use the search bar...</TextMessage>
      )}
    </ContentWrapper>
  );
}
