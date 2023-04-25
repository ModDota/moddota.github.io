import React, { useContext } from "react";
import { ContentWrapper, ListItem, StyledSearchBox, TextMessage } from "~components/layout/Content";
import { Author } from "~components/Author";
import { LazyList, ScrollableList } from "~components/Lists";
import { useFilteredData } from "./utils/filtering";
import { ClassDeclaration } from "./ClassDeclaration";
import { Constant } from "./Constant";
import { Enum } from "./Enum";
import { FunctionDeclaration } from "./FunctionDeclaration";
import { Declaration } from "~components/Docs/api";
import { DeclarationsContext } from "~components/Docs/DeclarationsContext";

function renderItem(declaration: Declaration, style?: React.CSSProperties) {
  let children: JSX.Element;
  switch (declaration.kind) {
    case "class":
      children = <ClassDeclaration declaration={declaration} />;
      break;
    case "enum":
      children = <Enum element={declaration} />;
      break;
    case "constant":
      children = <Constant element={declaration} />;
      break;
    case "function":
      children = <FunctionDeclaration context="functions" declaration={declaration} />;
      break;
  }

  return (
    <ListItem style={style} key={declaration.name}>
      {children}
    </ListItem>
  );
}

export function ContentList() {
  const { root, declarations } = useContext(DeclarationsContext);
  const { data, isSearching } = useFilteredData(declarations);

  return (
    <ContentWrapper>
      <StyledSearchBox baseUrl={root} />

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

      {!isSearching && !data.length && <Author />}
    </ContentWrapper>
  );
}
