import React, { useCallback, useMemo } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowRenderer,
} from 'react-virtualized';

interface Props<T> {
  className?: string;
  data: T[];
  render(element: T, style?: React.CSSProperties): React.ReactNode;
}

export function LazyList<T>({ className, data, render }: Props<T>) {
  const cache = useMemo(() => new CellMeasurerCache({ fixedWidth: true }), [data]);
  const renderRow = useCallback<ListRowRenderer>(
    ({ key, parent, style, index }) => (
      <CellMeasurer cache={cache} key={key} parent={parent} rowIndex={index}>
        {render(data[index], style)}
      </CellMeasurer>
    ),
    [cache, render, data],
  );

  return (
    <div className={className} style={{ flex: 1, overflowX: 'hidden' }}>
      <AutoSizer>
        {(size) => (
          <List
            style={{ overflowX: 'hidden' }}
            {...size}
            deferredMeasurementCache={cache}
            tabIndex={null}
            overscanRowCount={2}
            rowCount={data.length}
            rowHeight={cache.rowHeight}
            rowRenderer={renderRow}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export function ScrollableList<T>({ className, data, render }: Props<T>) {
  return (
    <div className={className} style={{ flex: 1, overflowX: 'hidden', overflowY: 'scroll' }}>
      {data.map((x) => render(x))}
    </div>
  );
}
