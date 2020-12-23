import api from 'dota-data/files/vscripts/api';
import apiTypes from 'dota-data/files/vscripts/api-types';
import enums from 'dota-data/files/vscripts/enums';
import { allData, AllDataType, getFuncDeepTypes } from 'dota-data/lib/helpers/vscripts';
import { useParams } from 'react-router-dom';
import { composeFilters, useRouterSearch } from '~components/Search';
import { isNotNil } from '~utils/types';

export function useFilteredData() {
  const search = useRouterSearch();
  const { scope = '' } = useParams<{ scope?: string }>();

  if (search) {
    return { data: doSearch(search.toLowerCase().split(' ')), isSearching: true };
  }

  let data: AllDataType[];
  switch (scope) {
    case 'functions':
      data = allData.filter((x) => x.kind === 'function');
      break;
    case 'constants':
      data = allData.filter((x) => x.kind === 'constant');
      break;
    default:
      data = allData.filter((x) => x.name === scope);
  }

  return { data, isSearching: false };
}

const overrideReferences: Record<string, string[]> = {
  TraceCollideable: ['TraceCollideableOutputs'],
  TraceHull: ['TraceHullOutputs'],
  TraceLine: ['TraceLineOutputs'],
};

export function getReferencesForFunction(func: api.FunctionDeclaration) {
  const allReferences = new Set<apiTypes.Object>();

  function addReference(name: string) {
    const reference = apiTypes.find((t) => t.name === name);
    if (!reference || reference.kind !== 'object') return;

    allReferences.add(reference);
    for (const extendedType of reference.extend ?? []) {
      addReference(extendedType);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  (overrideReferences[func.name] ?? getFuncDeepTypes(func)).forEach(addReference);

  return [...allReferences];
}

const AVAILABILITY_PATTERN = /^-?on:(client|server)$/;
const ABSTRACT_METHOD_PATTERN = /^-?is:abstract$/;

export function doSearch(words: string[]) {
  const availabilityWords = words.filter((x) => AVAILABILITY_PATTERN.test(x));
  const abstractMethodWords = words.filter((x) => ABSTRACT_METHOD_PATTERN.test(x));
  const typeWords = words.filter((x) => x.startsWith('type:')).map((x) => x.replace(/^type:/, ''));
  const nameWords = words.filter(
    (x) =>
      !x.startsWith('type:') && !AVAILABILITY_PATTERN.test(x) && !ABSTRACT_METHOD_PATTERN.test(x),
  );

  function filterAvailability(member: { available: api.Availability } | {}) {
    if (availabilityWords.length === 0) return undefined;
    if (!('available' in member)) return false;

    if (member.available === 'server') {
      return availabilityWords.includes('on:server');
    }

    if (member.available === 'client') {
      return availabilityWords.includes('on:client');
    }

    return !availabilityWords.includes('-on:server') && !availabilityWords.includes('-on:client');
  }

  function filterAbstractMethod(member: api.ClassMember) {
    if (abstractMethodWords.length === 0) return undefined;

    const isAbstract = member.kind === 'function' && member.abstract === true;
    return abstractMethodWords.includes('-is:abstract') ? !isAbstract : isAbstract;
  }

  function filterMemberType(member: api.ClassMember) {
    if (typeWords.length === 0) return undefined;

    const types = (member.kind === 'function'
      ? getFuncDeepTypes(member)
      : member.types
    ).map((type) => type.toLowerCase());
    return typeWords.every((type) => types.some((x) => x.includes(type)));
  }

  function filterDeclarationType(declaration: AllDataType) {
    if (typeWords.length === 0) return undefined;

    return (
      declaration.kind === 'class' &&
      declaration.extend !== undefined &&
      typeWords.includes(declaration.extend.toLowerCase())
    );
  }

  function filterName(member: { name: string }) {
    if (nameWords.length === 0) return undefined;

    const name = member.name.toLowerCase();
    return nameWords.every((word) => name.includes(word));
  }

  return allData
    .map((declaration) => {
      const partialDeclaration: api.ClassDeclaration | enums.Enum | undefined =
        declaration.kind === 'class'
          ? {
              ...declaration,
              members: declaration.members.filter(
                composeFilters([
                  filterName,
                  filterAbstractMethod,
                  filterAvailability,
                  filterMemberType,
                ]),
              ),
            }
          : declaration.kind === 'enum'
          ? {
              ...declaration,
              members: declaration.members.filter(composeFilters([filterName, filterAvailability])),
            }
          : undefined;

      if (partialDeclaration && partialDeclaration.members.length > 0) {
        return partialDeclaration;
      }

      if (composeFilters([filterName, filterAvailability, filterDeclarationType])(declaration)) {
        const element = { ...declaration };
        if (element.kind === 'class' || element.kind === 'enum') element.members = [];
        return element;
      }
    })
    .filter(isNotNil);
}
