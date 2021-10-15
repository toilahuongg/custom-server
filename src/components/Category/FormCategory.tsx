import { observer } from 'mobx-react';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTreeCategories } from '@src/hooks';
import useStore from '../../stores';
type TProps = {
  type: string;
};
const FormCategory: React.FC<TProps> = ({ type }) => {
  const { category } = useStore();
  const { detailCategory } = category;
  const {
    _id, title, description, setTitle, parent, setDescription, setParent,
  } = detailCategory;
  const { treeCategory } = useTreeCategories(type, _id || null);
  return (
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
        <Form.Select aria-label="Select Category Parent" value={parent || ''} onChange={(e: React.FormEvent<HTMLSelectElement>) => setParent(e.currentTarget.value)}>
          <option value="">Category Parent</option>
          {
            treeCategory.map(({ _id, title, prefix }) => <option value={_id} key={_id}> {prefix} {title} </option>)
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
