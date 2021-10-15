import { observer } from 'mobx-react';
import React from 'react';
import { Form } from 'react-bootstrap';
import useStore from '../../stores';

const FormTag: React.FC = () => {
  const { tag } = useStore();
  const { detailTag } = tag;
  const { title, setTitle } = detailTag;
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
    </Form>
  );
};
export default observer(FormTag);
