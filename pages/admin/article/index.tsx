import {
  ChangeEvent, FormEvent, useEffect, useRef, useState,
} from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Button, ButtonGroup, Col, Form, Row,
} from 'react-bootstrap';
import {
  Back, GripVertical, PencilSquare, PlusSquare, Trash,
} from 'react-bootstrap-icons';
import { observer } from 'mobx-react';
import moment from 'moment';
import { applySnapshot } from 'mobx-state-tree';
import { toast } from 'react-toastify';

import database from '../../../server/utils/database';
import ArticleModel from '../../../server/models/article';

import useStore from '../../../src/stores';
import DataTable from '../../../src/components/Admin/DataTable';
import Master from '../../../src/components/Admin/Master';
import Card from '../../../src/components/Admin/Card';
import ModalDeleteArticle from '../../../src/components/Admin/Article/ModalDeleteArticle';
import CustomButton from '../../../src/components/Button';
import CustomPagination from '../../../src/components/Admin/Pagination';
import { toastErrorMessage } from '../../../src/helper/common';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  await database();
  const countPage = await ArticleModel.count();
  const { query } = context;
  const { page, limit, s } = query;
  return {
    props: {
      page: page as string || '1',
      limit: limit as string || '15',
      s: s as string || '',
      countPage,
    },
  };
};

type TProps = {
  page: string,
  limit: string,
  s: string
  countPage: number
};

const ArticlePage: React.FC<TProps> = ({ page, limit, s, countPage }) => {
  const router = useRouter();
  const { query } = router;
  const [active, setActive] = useState<boolean>(false);
  const [loadingClone, setLoadingClone] = useState<boolean[]>([]);
  const [loadingDeleteArticles, setLoadingDeleteArticles] = useState<boolean>(false);
  const typingTimeoutRef = useRef(null);
  const swappingTimeoutRef = useRef(null);
  const { article } = useStore();
  const {
    loading,
    listArticle,
    detailArticle,
    setLoading,
    cloneArticle,
    getArticles,
    getArticleById,
    deleteArticle,
    deleteArticles,
    sortArticle,
    actionSelectArticle,
    checkSelectArticle,
    checkSelectAll,
  } = article;
  const toggleModal = () => setActive(!active);

  const handleClickDelete = (id: string) => {
    const data = getArticleById(id);
    applySnapshot(detailArticle, data);
    toggleModal();
  };
  const actionCloneArticle = async (id: string) => {
    try {
      const arrLoading = [...loadingClone];
      arrLoading[id] = true;
      setLoadingClone(arrLoading);
      await cloneArticle(id);
      toast.success('Clone success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      const arrLoading = [...loadingClone];
      arrLoading[id] = false;
      setLoadingClone(arrLoading);
    }
  };

  const actionDeleteArticle = async () => {
    try {
      detailArticle.setLoading(true);
      await deleteArticle();
      toggleModal();
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      detailArticle.setLoading(false);
    }
  };

  const actionDeleteArticles = async () => {
    try {
      setLoadingDeleteArticles(true);
      await deleteArticles();
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      setLoadingDeleteArticles(false);
    }
  };

  const actionSortArticle = async ({ oldIndex, newIndex }) => {
    try {
      await sortArticle(oldIndex, newIndex);
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
      label: <Form.Check type="checkbox" onChange={() => actionSelectArticle('select-all')} checked={checkSelectAll()} />,
    },
    {
      size: '20%',
      label: 'Title',
    },
    {
      size: '30%',
      label: 'Description',
    },
    {
      size: '25%',
      label: 'Time',
    },
    {
      size: '20%',
      label: 'Actions',
    },
  ];

  const rows = listArticle.map((item) => [
    <Form.Check type="checkbox" onChange={() => actionSelectArticle('select-article', item._id)} checked={checkSelectArticle(item._id)} />,
    <Link href={`/admin/article/${item._id}/edit`}>
      <a>
        {item.title}
      </a>
    </Link>,
    item.description,
    (
      <>
        <small><b>Created at:</b> {moment(item.createdAt).format('lll')} </small> <br />
        <small><b>Updated at:</b> {moment(item.updatedAt).format('lll')} </small>
      </>
    ),
    (
      <ButtonGroup>
        <CustomButton size="sm" variant="link" onClick={() => actionCloneArticle(item._id)} loading={loadingClone[item._id]}>
          <Back color="#716F81" size="20" />
        </CustomButton>
        <Button size="sm" variant="link" onClick={() => handleClickDelete(item._id)}>
          <Trash color="red" size="20" />
        </Button>
        <Button size="sm" variant="link">
          <Link href={`/admin/article/${item._id}/edit`}>
            <a>
              <PencilSquare color="blue" size="20" />
            </a>
          </Link>
        </Button>
        <Button size="sm" variant="link" className="handle" style={{ cursor: 'all-scroll' }}>
          <GripVertical color="#000" size="20" />
        </Button>
      </ButtonGroup>
    )]);

  const run = async () => {
    try {
      setLoading(true);
      await getArticles({ page, limit, s });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
  }, [page, limit, s]);

  return (
    <Master title="List Article">
      <Card>
        <div className="d-flex justify-content-between">
          <div>
            <Link href="/admin/article/create">
              <Button>
                <PlusSquare /> New Article
              </Button>
            </Link>
            <CustomButton variant="danger" className="mx-3" onClick={actionDeleteArticles} loading={loadingDeleteArticles}>
              <Trash /> Delete
            </CustomButton>
          </div>
          <div style={{ width: '50%' }}>
            <Row>
              <Col sm="4">
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
              <Col sm="4">
                <Form.Select aria-label="Select Category" onChange={() => {}}>
                  <option value="15">Choose category</option>
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
        loading={loading}
        sortable={actionSortArticle}
      />
      <CustomPagination countPage={countPage} currentPage={parseInt(page, 10)} limit={parseInt(limit, 10)} />
      <ModalDeleteArticle active={active} toggleModal={toggleModal} action={actionDeleteArticle} />
    </Master>
  );
};
export default observer(ArticlePage);
