import React from 'react';
import styled from 'styled-components';

const TextMessageAuthor = styled.div`
  max-width: 600px;
  border: 2px solid #000;
  padding: 15px;
  margin-top: 50px;
  align-self: center;
  font-size: 20px;
  color: #cddc39;
`;

export function Author() {
  return (
    <TextMessageAuthor>
      This page was created by <b>ark120202</b> who unfortunately has passed away on 29th November
      2020 at the age of 18.
      <br />
      <br />
      ark120202 was a pillar and champion of this community, he spent countless hours helping
      others, developing tools, and selflessly sharing his brilliance and intelligence to all that
      asked for help.
      <br />
      <br />
      You will always be remembered. — ModDota Community
    </TextMessageAuthor>
  );
}
