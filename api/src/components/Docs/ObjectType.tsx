import apiTypes from "@moddota/dota-data/files/vscripts/api-types";
import React from "react";
import styled from "styled-components";
import { Field } from "./Field";
import { KindIcon } from "./utils/components";
import { CommonGroupMembers, CommonGroupWrapper } from "./utils/styles";

const ObjectHeader = styled.div`
  font-size: 12px;
  padding: 4px;
`;

const ObjectName = styled.span`
  font-weight: 600;
`;

const ObjectDescription = styled.div`
  font-size: 14px;
  margin: 5px 20px;
`;

const ObjectField = styled(Field)`
  font-size: 12px;
`;

export const ObjectType: React.FC<{
  className?: string;
  declaration: apiTypes.Object;
}> = ({ className, declaration }) => (
  <CommonGroupWrapper className={className}>
    <ObjectHeader>
      <KindIcon kind="interface" size="small" />
      <ObjectName>{declaration.name}</ObjectName>
      {declaration.extend && <> extends {declaration.extend.join(", ")}</>}
    </ObjectHeader>
    {declaration.description && <ObjectDescription>{declaration.description}</ObjectDescription>}
    {declaration.fields.length > 0 && (
      <CommonGroupMembers>
        {declaration.fields.map((field) => (
          <ObjectField key={field.name} element={field} />
        ))}
      </CommonGroupMembers>
    )}
  </CommonGroupWrapper>
);
