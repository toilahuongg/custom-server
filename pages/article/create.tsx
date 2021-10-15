import React, { useEffect } from 'react';
import { applySnapshot } from 'mobx-state-tree';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';
import ArticleLayout from '@src/components/Article/ArticleLayout';
import useStore from '@src/stores';

const CreateArticlePage: React.FC = () => {
  const router = useRouter();
  const { article } = useStore();
  const { detailArticle, actionArticle } = article;
  const back = () => router.push('/article');
  const handleClick = (e: React.MouseEvent) => async (isPublish: boolean) => {
    try {
      e.preventDefault();
      console.log(isPublish);
      detailArticle.setLoading(true);
      await actionArticle();
      toast.success('Success');
      back();
    } catch (error) {
      toast.error(error.message);
    } finally {
      detailArticle.setLoading(false);
    }
  };
  useEffect(() => {
    return () => applySnapshot(detailArticle, {});
  }, []);
  return <ArticleLayout title="New Article" txtSave="Publish" onSave={handleClick} />;
};
export default observer(CreateArticlePage);
