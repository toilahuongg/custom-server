import React, { ReactNode, useEffect, useRef } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Sortable from 'sortablejs';
import styles from './datatable.module.scss';

type THeading = {
  size: number | string,
  label: number | string | ReactNode
};
type Row = number | string | ReactNode;
type TProps = {
  headings: THeading[],
  rows: Row[][],
  loading?: boolean,
  sortable: ({ oldIndex, newIndex }) => void,
};

const DataTable: React.FC<TProps> = ({ headings, rows, loading, sortable }) => {
  const element = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    Sortable.create(element.current, {
      group: 'sorting',
      handle: '.handle',
      sort: true,
      onChange: sortable,
    });
  }, []);

  return (
    <div className={styles.card}>
      <Table hover responsive>
        <thead>
          <tr>
            {headings.map((elm) => <th key={uuidv4()} style={{ width: elm.size }}> {elm.label} </th>)}
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
                <tr key={uuidv4()}>
                  {
                  row.map((elm: any) => <td key={uuidv4()}> { elm } </td>)
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
