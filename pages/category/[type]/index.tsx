import { observer } from 'mobx-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, 
{ 
  useRef,
  useState,
} from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import {
  Back, GripVertical, PencilSquare, PlusSquare, Trash, 
} from 'react-bootstrap-icons';
import DataTable from '@src/components/Layout/DataTable';
import AdminLayout from '@src/components/AdminLayout';
import Card from '@src/components/Layout/Card';
import useStore from '@src/stores';
import CustomButton from '@src/components/Layout/Button';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import moment from 'moment';
import ModalCategory from '@src/components/Category/ModalCategory';
import { makeid, toastErrorMessage } from '@src/helper/common';
import { toast } from 'react-toastify';
import ModalDeleteCategory from '@src/components/Category/ModalDeleteCategory';
import { useTreeCategories } from '@src/hooks';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const { type } = params;
  if (!(type === 'article')) {
    return { notFound: true };
  }
  return { props: { type: type as string } };
};


type TProps = {
  type: string,
};
const CategoryPage: React.FC<TProps> = ({ type }) => {
  const  { treeCategory, isLoading, setKeyChangeCategory } = useTreeCategories(type);
  const { category } = useStore();
  const {
    showModal,
    listCategory,
    detailCategory,
    actionCategory,
    actionSelectCategories,
    setShowModal,
    getCategoryById,
    addIdToListSortable,
    sortCategory,
    cloneCategory,
    deleteCategory,
    deleteCategories,
    checkSelectCategory,
    checkSelectAll, 
  } = category;
  const { setType, setLoading } = detailCategory;
  const [ typeAction, setTypeAction ] = useState<string>('add');
  const [loadingClone, setLoadingClone] = useState<boolean[]>([]);
  const [loadingDeleteCategories, setLoadingDeleteCategories] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const swappingTimeoutRef = useRef(null);

  const toggleModal = () => setActive(!active);
  const actionCloneCategory = async (id: string) => {
    try {
      const arrLoading = [...loadingClone];
      arrLoading[id] = true;
      setLoadingClone(arrLoading);
      await cloneCategory(id);
      setKeyChangeCategory(makeid(8));
      toast.success('Clone success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      const arrLoading = [...loadingClone];
      arrLoading[id] = false;
      setLoadingClone(arrLoading);
    }
  };

  const handleClickDelete = (id: string) => {
    const data = getCategoryById(id);
    applySnapshot(detailCategory, data);
    toggleModal();
  };

  const actionDeleteCategory = async () => {
    try {
      detailCategory.setLoading(true);
      await deleteCategory();
      toggleModal();
      setKeyChangeCategory(makeid(8));
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      detailCategory.setLoading(false);
    }
  };

  const actionDeleteCategories = async () => {
    try {
      setLoadingDeleteCategories(true);
      await deleteCategories();
      setKeyChangeCategory(makeid(8));
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      setLoadingDeleteCategories(false);
    }
  };

  const actionSortCategories = async () => {
    try {
      await sortCategory();
      if (swappingTimeoutRef.current) {
        clearTimeout(swappingTimeoutRef.current);
      }
      swappingTimeoutRef.current = setTimeout(() => {
        toast.success('Swap success');
      }, 500);
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    }
  };

  const fnActionCategory = async () => {
    try {
      setLoading(true);
      if (typeAction === 'edit') {
        await actionCategory('edit');
        toast.success('Edit success');
      } else {
        setType(type);
        await actionCategory();
        toast.success('Create success');
      }
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

  const fnOpenModal = (tp: string, id = '') => {
    setTypeAction(tp);
    setShowModal(true);
    if (tp === 'edit') {
      const item = listCategory.find(({ _id }) => _id === id);
      applySnapshot(detailCategory, getSnapshot(item));
    }
  };

  const headings = [
    {
      size: '5%',
      label: <Form.Check type="checkbox" onChange={() => actionSelectCategories('select-all')} checked={checkSelectAll()} />,
    },
    {
      size: '35%',
      label: 'Title',
    },
    {
      size: '30%',
      label: 'Description',
    },
    {
      size: '15%',
      label: 'Time',
    },
    {
      size: '15%',
      label: 'Actions',
    },
  ];
  const rows = treeCategory.map((item) => [
    <Form.Check type="checkbox" onChange={() => actionSelectCategories('select-category', item._id)} checked={checkSelectCategory(item._id)} />,
    <Button size="sm" variant="link" onClick={() => fnOpenModal('edit', item._id)} style={{ textDecoration: 'none' }}>
      {`${item.prefix || ''} ${item.title}`}
    </Button>
    ,
    item.description,
    (
      <>
        {moment(item.createdAt).format('lll')}
      </>
    ),
    (
      <ButtonGroup>
        <CustomButton size="sm" variant="link" onClick={() => actionCloneCategory(item._id)} loading={loadingClone[item._id]}>
          <Back color="#716F81" size="16" />
        </CustomButton>
        <Button size="sm" variant="link" onClick={() => fnOpenModal('edit', item._id)}>
          <PencilSquare color="blue" size="16" />
        </Button>
        <Button size="sm" variant="link" onClick={() => handleClickDelete(item._id)}>
          <Trash color="red" size="16" />
        </Button>
        <Button size="sm" variant="link" className="handle" style={{ cursor: 'all-scroll' }}>
          <GripVertical color="#000" size="16" />
        </Button>
      </ButtonGroup>
    )]);

  return (
    <AdminLayout title={`Category ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
      <Card>
        <Button onClick={() => fnOpenModal('add')}>
          <PlusSquare /> New Category
        </Button>
        <CustomButton variant="danger" className="mx-3" onClick={actionDeleteCategories} loading={loadingDeleteCategories}>
          <Trash /> Delete
        </CustomButton>
      </Card>
      <DataTable
        headings={headings}
        rows={rows}
        loading={isLoading}
        listenChange={addIdToListSortable}
        listenEnd={actionSortCategories}
        className="my-3"
      />
      {showModal && <ModalCategory type={type} title={typeAction === 'add' ? 'New Category' : 'Edit Category'} action={fnActionCategory} />}
      <ModalDeleteCategory active={active} toggleModal={toggleModal} action={actionDeleteCategory} />
    </AdminLayout>
  );
};
export default observer(CategoryPage);
