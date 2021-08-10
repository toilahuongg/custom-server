import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';
import Master from '../../../../src/components/Admin/Master';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { type: 'article' } },
    ],
    fallback: false,
  };
};
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const { type } = params;
  return {
    props: { type: type as string },
    revalidate: 10,
  };
};

type TProps = {
  type: string,
};
const CategoryPage: React.FC<TProps> = ({ type }) => {
  return (
    <Master title="Category Article">
      { type }
    </Master>
  );
};

export default CategoryPage;
