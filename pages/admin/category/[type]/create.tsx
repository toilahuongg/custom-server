import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';

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
const CategoryCreatePage: React.FC<TProps> = ({ type }) => {
  return (
    <h1> { type } </h1>
  );
};

export default CategoryCreatePage;
