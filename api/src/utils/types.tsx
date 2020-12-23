export const isNotNil = <T,>(value: T): value is NonNullable<T> => value != null;

export const intersperse = <T, U>(values: readonly T[], separator: U): (T | U)[] =>
  values.flatMap((value, index) => (index === 0 ? [value] : [separator, value]));

export const intersperseWith = <T, U>(
  values: readonly T[],
  separator: (index: number) => U,
): (T | U)[] =>
  values.flatMap((value, index) => (index === 0 ? [value] : [separator(index), value]));

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
