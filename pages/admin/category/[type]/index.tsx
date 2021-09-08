import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React, { MouseEvent } from 'react';
import { Col, Row } from 'react-bootstrap';
import Card from '../../../../src/components/Admin/Card';
import FormCategory from '../../../../src/components/Admin/Category/FormCategory';
import DataTable from '../../../../src/components/Admin/DataTable';
import AdminLayout from '../../../../src/components/Admin';
import useStore from '../../../../src/stores';

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
  const { detailCategory } = category;
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

  const actionAddCategory = (e: MouseEvent) => {
    e.preventDefault();
    console.log(getSnapshot(detailCategory));
  };
  return (
    <AdminLayout title="Category Article">
      <Row>
        <Col sm="4">
          <Card className="p-3">
            <FormCategory action={actionAddCategory} />
          </Card>
        </Col>
        <Col sm="8">
          <DataTable
            headings={headings}
            rows={[]}
            loading={false}
            sortable={() => {}}
          />
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default observer(CategoryPage);
