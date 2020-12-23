import { AllDataType } from 'dota-data/lib/helpers/vscripts';
import React from 'react';
import { ContentWrapper, ListItem, StyledSearchBox, TextMessage } from '~components/layout/Content';
import { LazyList, ScrollableList } from '~components/Lists';
import { useFilteredData } from './data';
import { ClassDeclaration } from './elements/ClassDeclaration';
import { Constant } from './elements/Constant';
import { Enum } from './elements/Enum';
import { FunctionDeclaration } from './elements/FunctionDeclaration';

function renderItem(declaration: AllDataType, style?: React.CSSProperties) {
  let children: JSX.Element;
  switch (declaration.kind) {
    case 'class':
      children = <ClassDeclaration declaration={declaration} />;
      break;
    case 'enum':
      children = <Enum element={declaration} />;
      break;
    case 'constant':
      children = <Constant element={declaration} />;
      break;
    case 'function':
      children = <FunctionDeclaration context="functions" declaration={declaration} />;
      break;
  }

  return (
    <ListItem style={style} key={declaration.name}>
      {children}
    </ListItem>
  );
}

export function Content() {
  const { data, isSearching } = useFilteredData();

  return (
    <ContentWrapper>
      <StyledSearchBox baseUrl="/vscripts" />

      {data.length > 0 ? (
        isSearching ? (
          <LazyList data={data} render={renderItem} />
        ) : (
          <ScrollableList data={data} render={renderItem} />
        )
      ) : isSearching ? (
        <TextMessage>No results found</TextMessage>
      ) : (
        <TextMessage>Choose a category or use the search bar...</TextMessage>
      )}
    </ContentWrapper>
  );
}
