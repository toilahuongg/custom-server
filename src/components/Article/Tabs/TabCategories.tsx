import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import useStore from '@src/stores';

const TabCategories: React.FC = () => {
  const { category, article } = useStore();
  const { detailArticle } = article;
  const { getTreeCategories } = category;
  const { checkCategory, selectCategory } = detailArticle;
  const [loading, setLoading] = useState<boolean>(false);
  const [optionCategoriesParent, setOptionCategoriesParent] = useState([]);
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const options = await getTreeCategories('checkbox');
        setOptionCategoriesParent(options);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    run();
  }, []);
  if (loading) return <> Loading ... </>;
  return (
    <>
    {
      optionCategoriesParent.map(({ value, label, prefix }) => (
        <Form.Check 
          key={value}
          style={{ marginLeft: `${parseInt(prefix) * 10}px` }}
          type="checkbox"
          checked={checkCategory(value)}
          onChange={() => selectCategory(value)}
          label={label}
        />
      ))
    }
    </>
  );
};
export default TabCategories;