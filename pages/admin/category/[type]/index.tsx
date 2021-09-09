import { observer } from 'mobx-react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React, { MouseEvent, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import DataTable from '../../../../src/components/Admin/DataTable';
import AdminLayout from '../../../../src/components/Admin';
import Card from '../../../../src/components/Admin/Card';
import useStore from '../../../../src/stores';
import FormCategory from '../../../../src/components/Admin/Category/FormCategory';
import CustomButton from '../../../../src/components/Admin/Button';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { type: 'article' } },
    ],
    fallback: false,
  };
};
export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const { type } = params;
  return {
    props: { type: type as string },
    revalidate: 10,
  };
};

type TProps = {
  type: string,
};
const CategoryPage: React.FC<TProps> = ({ type }) => {
  const { category } = useStore();
  const { detailCategory, actionCategory } = category;
  const { loading, setType, setLoading } = detailCategory;
  const [showModal, setShowModal] = useState<boolean>(false);
  const headings = [
    {
      size: '5%',
      label: '#',
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

  const actionAddCategory = async (e: MouseEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      setType(type);
      await actionCategory();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AdminLayout title="Category Article">
      <Card>
        <Button onClick={() => setShowModal(true)}>
          <PlusSquare /> New Category
        </Button>
      </Card>
      <DataTable
        headings={headings}
        rows={[]}
        loading={false}
        sortable={() => {}}
        className="my-3"
      />
      <Modal show={showModal} size="lg" onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCategory />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <CustomButton variant="primary" onClick={actionAddCategory} loading={loading}>
            Save
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default observer(CategoryPage);
