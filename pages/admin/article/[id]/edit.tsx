import React, { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Error from 'next/error';

import { applySnapshot } from 'mobx-state-tree';
import { Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

import AdminLayout from '../../../../src/components/Admin';
import FormArticle from '../../../../src/components/Admin/Article/FormArticle';
import useStore from '../../../../src/stores';
import { IArticleModelOut } from '../../../../src/stores/article';
import CustomButton from '../../../../src/components/Admin/Button';
import Article from '../../../../server/models/article';
import database from '../../../../server/utils/database';
import { makeid } from '../../../../src/helper/common';

export const getStaticPaths: GetStaticPaths = async () => {
  await database();
  const response = await Article.find().lean();
  const paths = response.map((article: IArticleModelOut) => ({ params: { id: `${article._id}` } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const { params } = context;
    const { id } = params;
    await database();
    const response = await Article.findById(id).lean();
    return { props: { item: JSON.parse(JSON.stringify(response)) }, revalidate: 1 };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

type TProps = {
  item: IArticleModelOut;
};
const EditArticlePage: React.FC<TProps> = ({ item }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (!item) return <Error statusCode={404} />;
  const [keyEditor, setKeyEditor] = useState('');
  const { article } = useStore();
  const { loading, detailArticle, setLoading, actionArticle } = article;

  const back = () => router.push('/admin/article');
  const handleClick = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      await actionArticle('edit');
      toast.success('Success');
      back();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applySnapshot(detailArticle, item);
    setKeyEditor(makeid(10));
    return () => applySnapshot(detailArticle, {});
  }, []);
  return (
    <AdminLayout title="Edit Article">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-dark" onClick={back}> <ArrowReturnLeft /> </Button>
        <div>
          <CustomButton onClick={handleClick} loading={loading}>
            Save
          </CustomButton>
        </div>
      </div>
      <FormArticle keyEditor={keyEditor} />
    </AdminLayout>
  );
};

export default observer(EditArticlePage);
