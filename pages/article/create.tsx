import React, { useEffect } from 'react';
import { applySnapshot } from 'mobx-state-tree';
import { Button } from 'react-bootstrap';
import { ArrowReturnLeft } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';
import AdminLayout from '@src/components/AdminLayout';
import FormArticle from '@src/components/Article/FormArticle';
import useStore from '@src/stores';
import CustomButton from '@src/components/Layout/Button';

const CreateArticlePage: React.FC = () => {
  const router = useRouter();
  const { article } = useStore();
  const { loading, detailArticle, setLoading, actionArticle } = article;
  const back = () => router.push('/article');
  const handleClick = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      await actionArticle();
      toast.success('Success');
      back();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => applySnapshot(detailArticle, {});
  }, []);
  return (
    <AdminLayout title="New Article">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-dark" onClick={back}> <ArrowReturnLeft /> </Button>
        <div>
          <CustomButton onClick={handleClick} loading={loading}>
            Save
          </CustomButton>
        </div>
      </div>
      <FormArticle />
    </AdminLayout>
  );
};
export default observer(CreateArticlePage);
