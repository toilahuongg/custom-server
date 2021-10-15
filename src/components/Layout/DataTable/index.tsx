import React, { ReactNode, useEffect, useRef } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import Sortable from 'sortablejs';
import styles from './datatable.module.scss';

type THeading = {
  size: number | string,
  label: number | string | ReactNode
};
type Row = number | string | ReactNode;
type TProps = React.HTMLAttributes<HTMLElement> & {
  headings: THeading[],
  rows: Row[][],
  loading?: boolean,
  listenChange: ({ oldIndex, newIndex }) => void,
  listenEnd?: () => Promise<void>,
};

const DataTable: React.FC<TProps> = ({
  headings, rows, loading, listenChange, listenEnd, ...props
}) => {
  const { className } = props;
  const element = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    Sortable.create(element.current, {
      group: 'sorting',
      handle: '.handle',
      sort: true,
      onChange: listenChange,
      onEnd: listenEnd,
    });
  }, []);

  return (
    <div {...props} className={`${styles.card} ${className}`}>
      <Table hover responsive>
        <thead>
          <tr>
            {headings.map((elm) => <th key={nanoid()} style={{ width: elm.size }}> {elm.label} </th>)}
          </tr>
        </thead>
        <tbody ref={element}>

          {
            loading ? (
              <tr>
                <td colSpan={100}>
                  <div className="d-flex justify-content-center align-items-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                </td>
              </tr>
            )
              : rows.map((row) => (
                <tr key={nanoid()}>
                  {
                  row.map((elm: any) => <td key={nanoid()}> { elm } </td>)
                }
                </tr>
              ))
          }
        </tbody>
      </Table>
    </div>

  );
};
export default DataTable;
