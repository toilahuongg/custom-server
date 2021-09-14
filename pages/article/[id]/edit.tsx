import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { applySnapshot } from 'mobx-state-tree';
import { Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

import AdminLayout from '@src/components';
import FormArticle from '@src/components/Article/FormArticle';
import useStore from '@src/stores';
import { IArticleModelOut } from '@src/stores/article';
import CustomButton from '@src/components/Button';
import Article from '@server/models/article';
import database from '@server/utils/database';
import { makeid } from '@src/helper/common';
import SidebarContext from '@src/components/Sidebar/models';


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  await database();
  const { params } = context;
  const { id } = params;
  const response = await Article.findById(id).lean();
  if (!response) {
    return { notFound: true };
  }
  return { props: { item: JSON.parse(JSON.stringify(response)) } };
};

type TProps = {
  item: IArticleModelOut;
};
const EditArticlePage: React.FC<TProps> = ({ item }) => {
  const router = useRouter();
  const [keyEditor, setKeyEditor] = useState('');
  const { article } = useStore();
  const { setIsShowSidebar } = useContext(SidebarContext);
  const { loading, detailArticle, setLoading, actionArticle } = article;

  const back = () => router.push('/article');
  const handleClick = async (e: React.MouseEvent) => {
    try {
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
    setIsShowSidebar(false);
    setKeyEditor(makeid(10));
    return () => {
      setIsShowSidebar(true);
      applySnapshot(detailArticle, {});
    };
  }, []);
  return (
    <AdminLayout title="Edit Article">
      <div className="d-flex justify-content-between mb-3 mx-3">
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
