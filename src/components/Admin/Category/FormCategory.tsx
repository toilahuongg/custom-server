import { observer } from 'mobx-react';
import React, { MouseEvent } from 'react';
import { Form } from 'react-bootstrap';
import useStore from '../../../stores';
import CustomButton from '../Button';

type TProps = {
  action: (e: MouseEvent) => void,
};
const FormCategory: React.FC<TProps> = ({ action }) => {
  const { category } = useStore();
  const { detailCategory } = category;
  const {
    loading, title, description, setTitle, setDescription,
  } = detailCategory;
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
        <Form.Select aria-label="Select Category Parent">
          <option value="0">Category Parent</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
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
      <CustomButton onClick={action} variant="primary" type="submit" loading={loading}>
        Save
      </CustomButton>
    </Form>
  );
};
export default observer(FormCategory);
