import React from 'react';
import { applySnapshot } from 'mobx-state-tree';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useStore from '@src/stores';
import { observer } from 'mobx-react';
import { useTreeCategories } from '@src/hooks';
import ModalCategory from '@src/components/Category/ModalCategory';
import { makeid, toastErrorMessage } from '@src/helper/common';

const TabCategories: React.FC = () => {
  const { article, category } = useStore();
  const { detailArticle } = article;
  const { setShowModal, actionCategory, detailCategory } = category;
  const { setType, setLoading } = detailCategory;
  const { checkCategory, selectCategory } = detailArticle;
  const { treeCategory, isLoading, setKeyChangeCategory } = useTreeCategories('article');

  const fnActionCategory = async () => {
    try {
      setType('article');
      await actionCategory();
      toast.success('Create success');
      setKeyChangeCategory(makeid(8));
      applySnapshot(detailCategory, {});
      setShowModal(false);
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <> Loading ... </>;
  return (
    <>
      {
        treeCategory.map(({ _id, title, prefix }) => (
          <Form.Check 
            key={_id}
            style={{ marginLeft: `${(prefix ? prefix.length / 2 : 0) * 15}px` }}
            type="checkbox"
            checked={checkCategory(_id)}
            onChange={() => selectCategory(_id)}
            label={title}
          />
        ))
      }
      <Button variant="link" style={{ fontSize: '12px' }} onClick={() => setShowModal(true)}> New category </Button>
      <ModalCategory type="article" title="New Category" action={fnActionCategory} />
    </>
  );
};
export default observer(TabCategories);