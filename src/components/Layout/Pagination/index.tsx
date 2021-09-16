import { useRouter } from 'next/router';
import React from 'react';
import { Pagination } from 'react-bootstrap';

type TProps = {
  countPage: number,
  currentPage: number,
  limit: number
};
const CustomPagination: React.FC<TProps> = ({ countPage, currentPage, limit }) => {
  const router = useRouter();
  const { query } = router;
  const items = [];
  const pages = countPage % limit === 0 ? countPage / limit : countPage / limit + 1;
  for (let number = 1; number <= pages; number += 1) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => router.push({ query: { ...query, page: number } })}
      >
        {number}
      </Pagination.Item>,
    );
  }
  return (
    <Pagination> {items} </Pagination>
  );
};

export default CustomPagination;
