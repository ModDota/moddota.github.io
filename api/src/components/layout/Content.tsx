import styled from 'styled-components';
import { SearchBox } from '~components/Search';

export const ContentWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-flow: column;
`;

export const StyledSearchBox = styled(SearchBox)`
  margin: 6px;
`;

export const TextMessage = styled.div`
  margin-top: 50px;
  align-self: center;
  font-size: 42px;
`;

export const ListItem = styled.div`
  box-sizing: border-box;
  padding: 6px;
  :not(:last-child) {
    padding-bottom: 0;
  }
`;
