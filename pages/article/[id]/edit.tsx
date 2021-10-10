import React, { useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

import database from '@server/utils/database';

import useStore from '@src/stores';
import { IArticleModelOut } from '@src/stores/article';
import ArticleLayout from '@src/components/Article/ArticleLayout';


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const db = await database();
  const { params } = context;
  const { id } = params;
  const response = await db.models.Article.findById(id).lean();
  console.log(response);
  if (!response) {
    return { notFound: true };
  }
  return { props: { item: JSON.parse(JSON.stringify(response)) } };
};

type TProps = {
  item: IArticleModelOut;
};
const EditArticlePage: React.FC<TProps> = ({ item }) => {
  const { article } = useStore();
  const { detailArticle, setLoading, actionArticle } = article;

  const handleClick =  (e: React.MouseEvent) => async (isPublish: boolean) => {
    try {
      console.log(isPublish);
      e.preventDefault();
      setLoading(true);
      await actionArticle('edit');
      toast.success('Success');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applySnapshot(detailArticle, item);
    return () => {
      applySnapshot(detailArticle, {});
    };
  }, []);
  return <ArticleLayout title={detailArticle.title || 'Edit Article'} txtSave="Update" onSave={handleClick} />;
};

export default observer(EditArticlePage);
