import React from 'react';
import { observer } from 'mobx-react';
import useStore from '../../stores';
import styles from './article.module.scss';
import { ArrowReturnLeft } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import Editor from '../Editor';
import EditorLayout from '../Editor/EditorLayout';
import CustomButton from '../Layout/Button';
import SidebarEditor, { TMenu } from '../Editor/SidebarEditor';
import { useRouter } from 'next/router';
import TabCategories from './Tabs/TabCategories';
import TabFeaturedImage from './Tabs/TabFeaturedImage';

type TProps = {
  title: string;
  txtSave: string;
  onSave: (e: React.MouseEvent) => (isPublish: boolean) => Promise<void>
};

const ArticleLayout: React.FC<TProps> = ({ title: titlePage, txtSave, onSave }) => {
  const router = useRouter();
  const { article } = useStore();
  const { detailArticle } = article;
  const {
    title, loading, content, setTitle, setContent,
  } = detailArticle;

  const menu: TMenu[] = [
    {
      id: '0',
      title: 'General',
      render: <h1> hi </h1>,
    },
    {
      id: '1',
      title: 'Categories',
      render: <TabCategories />,
    },
    {
      id: '2',
      title: 'Featured Image',
      render:  <TabFeaturedImage />,
    },
  ];

  const back = () => router.push('/article');

  return (
    <EditorLayout title={titlePage} action={
      <CustomButton onClick={(e: React.MouseEvent) => onSave(e)(true)} loading={loading}>
        { txtSave }
      </CustomButton>
      } sidebar={<SidebarEditor menu={menu} back={<Button variant="outline-dark" onClick={back}> <ArrowReturnLeft /> </Button>} />}>
      <div className={styles.form}>
        <div className={styles.formTitle}>
          <input type="text" placeholder="Title...." value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.formContent}>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </EditorLayout>
  );
};
export default observer(ArticleLayout);
