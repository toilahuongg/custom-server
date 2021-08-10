import React, { MouseEvent, useEffect } from 'react';
import { applySnapshot } from 'mobx-state-tree';
import { Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';
import Master from '../../../../src/components/Admin/Master';
import FormArticle from '../../../../src/components/Admin/Article/FormArticle';
import useStore from '../../../../src/stores';
import { IArticleModelOut } from '../../../../src/stores/article';
import CustomButton from '../../../../src/components/Button';
import Article from '../../../../server/models/article';
import database from '../../../../server/utils/database';

export const getStaticPaths: GetStaticPaths = async () => {
  await database();
  const response = await Article.find().lean();
  const paths = response.map((article: IArticleModelOut) => ({ params: { id: `${article._id}` } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const { id } = params;
  await database();
  const response = await Article.findById(id).lean();
  return { props: { item: JSON.parse(JSON.stringify(response)) }, revalidate: 10 };
};

type TProps = {
  item: IArticleModelOut;
};
const EditArticlePage: React.FC<TProps> = ({ item }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
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
    return () => applySnapshot(detailArticle, {});
  }, []);
  return (
    <Master title="Edit Article">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-dark" onClick={back}> <ArrowReturnLeft /> </Button>
        <div>
          <CustomButton onClick={handleClick} loading={loading}>
            Save
          </CustomButton>
        </div>
      </div>
      <FormArticle />
    </Master>
  );
};

export default observer(EditArticlePage);
