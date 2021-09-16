import { observer } from 'mobx-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, 
{ 
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import {
  Button, ButtonGroup, Col, Form, Row,
} from 'react-bootstrap';
import {
  Back, GripVertical, PencilSquare, PlusSquare, Trash, 
} from 'react-bootstrap-icons';
import { useRouter } from 'next/dist/client/router';
import DataTable from '@src/components/Layout/DataTable';
import AdminLayout from '@src/components/AdminLayout';
import Card from '@src/components/Layout/Card';
import useStore from '@src/stores';
import CustomButton from '@src/components/Layout/Button';
import { applySnapshot } from 'mobx-state-tree';
import database from '@server/utils/database';
import CategoryModel from '@server/models/category';
import CustomPagination from '@src/components/Layout/Pagination';
import moment from 'moment';
import ModalCategory from '@src/components/Category/ModalCategory';
import { toastErrorMessage } from '@src/helper/common';
import { toast } from 'react-toastify';
import ModalDeleteCategory from '@src/components/Category/ModalDeleteCategory';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  await database();
  const { query, params } = context;
  const { page, limit, s, parentId } = query;
  const { type } = params;
  const pId = parentId as string || null;
  const countPage = await CategoryModel.find({ parendId: pId }).count();
  if (!(type === 'article')) {
    return { notFound: true };
  }
  return {
    props: {
      type: type as string, 
      page: page as string || '1',
      limit: limit as string || '15',
      s: s as string || '',
      parentId: pId,
      countPage, 
    },
  };
};


type TProps = {
  type: string,
  page: string,
  limit: string,
  s: string
  countPage: number,
  parentId: string
};
const CategoryPage: React.FC<TProps> = ({
  type, page, limit, s, countPage, parentId, 
}) => {
  const router = useRouter();
  const { query } = router;
  const { category } = useStore();
  const {
    showModal,
    listCategory,
    detailCategory,
    selectCategories,
    actionCategory,
    actionSelectCategories,
    setShowModal,
    getCategoryById,
    getCategories,
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
  const typingTimeoutRef = useRef(null);
  const swappingTimeoutRef = useRef(null);

  const toggleModal = () => setActive(!active);
  const actionCloneCategory = async (id: string) => {
    try {
      const arrLoading = [...loadingClone];
      arrLoading[id] = true;
      setLoadingClone(arrLoading);
      await cloneCategory(id);
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
      applySnapshot(detailCategory, item);
    }
  };
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      router.push({ query: { ...query, s: e.target.value, page: '1' } });
    }, 1000);
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
  const rows = listCategory.map((item) => [
    <Form.Check type="checkbox" onChange={() => actionSelectCategories('select-category', item._id)} checked={checkSelectCategory(item._id)} />,
    <Link href={{ query: { ...query, parentId: item._id, page: '1' } }}>
      <a style={{ fontSize: '12px' }}>
        {item.title}
      </a>
    </Link>
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

  
  const run = async () => {
    try {
      setLoading(true);
      await getCategories({ page, limit, s, parentId });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
    return () => {
      applySnapshot(detailCategory, {});
      applySnapshot(selectCategories, []);
    };
  }, [page, limit, s, parentId]);

  return (
    <AdminLayout title="Category Article">
      <Card>
        <div className="d-flex justify-content-between">
          <div>
            <Button onClick={() => fnOpenModal('add')}>
              <PlusSquare /> New Category
            </Button>
            <CustomButton variant="danger" className="mx-3" onClick={actionDeleteCategories} loading={loadingDeleteCategories}>
              <Trash /> Delete
            </CustomButton>
          </div>
          <div style={{ width: '50%' }}>
            <Row>
              <Col sm="8">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  className="mr-3"
                  onChange={handleChangeSearch}
                />
              </Col>
              <Col sm="4">
                <Form.Select
                  aria-label="Select Limit"
                  onChange={(e: FormEvent<HTMLSelectElement>) => {
                    const target = e.target as HTMLSelectElement;
                    router.push({ query: { ...query, limit: target.value, page: '1' } });
                  }}
                >
                  <option value="15">Choose limit</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Form.Select>
              </Col>

            </Row>
          </div>
        </div>
      </Card>
      <DataTable
        headings={headings}
        rows={rows}
        loading={false}
        listenChange={addIdToListSortable}
        listenEnd={actionSortCategories}
        className="my-3"
      />
      <CustomPagination countPage={countPage} currentPage={parseInt(page, 10)} limit={parseInt(limit, 10)} />
      {showModal && <ModalCategory action={fnActionCategory} />}
      <ModalDeleteCategory active={active} toggleModal={toggleModal} action={actionDeleteCategory} />
    </AdminLayout>
  );
};
export default observer(CategoryPage);
