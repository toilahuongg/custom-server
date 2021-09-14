import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import useStore from '../../stores';

const FormCategory: React.FC = () => {
  const { category } = useStore();
  const { detailCategory, getTreeCategories } = category;
  const {
    title, description, setTitle, parentId, setDescription, setParentId,
  } = detailCategory;
  const [loading, setLoading] = useState<boolean>(true);
  const [optionCategoriesParent, setOptionCategoriesParent] = useState([]);
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const options = await getTreeCategories();
        setOptionCategoriesParent(options);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    run();
  }, []);
  return loading ? <>Loading...</> : (
    <Form>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formParent">
        <Form.Label>Parent</Form.Label>
        <Form.Select aria-label="Select Category Parent" value={parentId || ''} onChange={(e: React.FormEvent<HTMLSelectElement>) => setParentId(e.currentTarget.value)}>
          <option value="">Category Parent</option>
          {
            optionCategoriesParent.map((option) => <option value={option.value} key={option.value}> {option.label} </option>)
          }
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          type="text"
          rows={5}
          placeholder="Enter..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
    </Form>
  );
};
export default observer(FormCategory);
