import { observer } from 'mobx-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, 
{ 
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button, ButtonGroup, Col, Form, Row,
} from 'react-bootstrap';
import {
  Back, GripVertical, PencilSquare, PlusSquare, Trash, 
} from 'react-bootstrap-icons';
import DataTable from '@src/components/Layout/DataTable';
import AdminLayout from '@src/components/AdminLayout';
import Card from '@src/components/Layout/Card';
import useStore from '@src/stores';
import CustomButton from '@src/components/Layout/Button';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import ModalTag from '@src/components/Tag/ModalTag';
import { toastErrorMessage } from '@src/helper/common';
import { toast } from 'react-toastify';
import ModalDeleteTag from '@src/components/Tag/ModalDeleteTag';
import moment from 'moment';
import { useTags } from '@src/hooks';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const { type } = params;
  return { props: { type: type as string } };
};


type TProps = {
  type: string,
};
const TagPage: React.FC<TProps> = ({ type }) => {
  const { tag } = useStore();
  const {
    showModal,
    listTag,
    detailTag,
    selectTags,
    actionTag,
    actionSelectTags,
    setShowModal,
    getTagById,
    cloneTag,
    deleteTag,
    deleteTags,
    checkSelectTag,
    checkSelectAll, 
  } = tag;
  const { setType, setLoading } = detailTag;
  const [ typeAction, setTypeAction ] = useState<string>('add');
  const [loadingClone, setLoadingClone] = useState<boolean[]>([]);
  const [loadingDeleteTags, setLoadingDeleteTags] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const typingTimeoutRef = useRef(null);

  const toggleModal = () => setActive(!active);
  const actionCloneTag = async (id: string) => {
    try {
      const arrLoading = [...loadingClone];
      arrLoading[id] = true;
      setLoadingClone(arrLoading);
      await cloneTag(id);
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
    const data = getTagById(id);
    applySnapshot(detailTag, data);
    toggleModal();
  };

  const actionDeleteTag = async () => {
    try {
      detailTag.setLoading(true);
      await deleteTag();
      toggleModal();
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      detailTag.setLoading(false);
    }
  };

  const actionDeleteTags = async () => {
    try {
      setLoadingDeleteTags(true);
      await deleteTags();
      toast.success('Delete success');
    } catch (error) {
      toast.error(toastErrorMessage(error.message));
    } finally {
      setLoadingDeleteTags(false);
    }
  };


  const fnActionTag = async () => {
    try {
      setLoading(true);
      if (typeAction === 'edit') {
        await actionTag('edit');
        toast.success('Edit success');
      } else {
        setType(type);
        await actionTag();
        toast.success('Create success');
      }
      applySnapshot(detailTag, {});
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
      const item = listTag.find(({ _id }) => _id === id);
      applySnapshot(detailTag, getSnapshot(item));
    }
  };
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchTitle(e.target.value);
    }, 1000);
  };


  const headings = [
    {
      size: '5%',
      label: <Form.Check type="checkbox" onChange={() => actionSelectTags('select-all')} checked={checkSelectAll()} />,
    },
    {
      size: '40%',
      label: 'Title',
    },
    {
      size: '30%',
      label: 'Time',
    },
    {
      size: '25%',
      label: 'Actions',
    },
  ];
  const { tags } = useTags(type);
  const rows = tags.filter(({ title }) => title.toLowerCase().includes(searchTitle.toLowerCase())).map((item) => [
    <Form.Check type="checkbox" onChange={() => actionSelectTags('select-Tag', item._id)} checked={checkSelectTag(item._id)} />,
    <Button size="sm" variant="link" onClick={() => fnOpenModal('edit', item._id)} style={{ textDecoration: 'none' }}>
      {item.title}
    </Button>
    ,
    (
      <>
        {moment(item.createdAt).format('lll')}
      </>
    )
    ,
    (
      <ButtonGroup>
        <CustomButton size="sm" variant="link" onClick={() => actionCloneTag(item._id)} loading={loadingClone[item._id]}>
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

  useEffect(() => {
    return () => {
      applySnapshot(detailTag, {});
      applySnapshot(selectTags, []);
    };
  }, []);

  return (
    <AdminLayout title={`Tag ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
      <Card>
        <div className="d-flex justify-content-between">
          <div>
            <Button onClick={() => fnOpenModal('add')}>
              <PlusSquare /> New Tag
            </Button>
            <CustomButton variant="danger" className="mx-3" onClick={actionDeleteTags} loading={loadingDeleteTags}>
              <Trash /> Delete
            </CustomButton>
          </div>
          <div style={{ width: '50%' }}>
            <Row>
              <Col sm="4">
              </Col>
              <Col sm="8">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  className="mr-3"
                  onChange={handleChangeSearch}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Card>
      <DataTable
        headings={headings}
        rows={rows}
        loading={false}
        listenChange={() => {}}
        // listenEnd={() => {}}
        className="my-3"
      />
      {showModal && <ModalTag title={typeAction === 'add' ? 'New Tag' : 'Edit Tag'} action={fnActionTag} />}
      <ModalDeleteTag active={active} toggleModal={toggleModal} action={actionDeleteTag} />
    </AdminLayout>
  );
};
export default observer(TagPage);
