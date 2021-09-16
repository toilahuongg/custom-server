import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import useStore from '../../stores';
import CustomButton from '../Layout/Button';
import FormCategory from './FormCategory';

type TProps = {
  action: () => Promise<void>;
};
const ModalCategory: React.FC<TProps> = ({ action }) => {
  const { category } = useStore();
  const { showModal, setShowModal, detailCategory } = category;
  const { loading } = detailCategory;
  const fnCloseModal = () => {
    setShowModal(false);
    applySnapshot(detailCategory, {});
  };
  return (
    <Modal show={showModal} size="lg" onHide={fnCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormCategory />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={fnCloseModal}>
          Close
        </Button>
        <CustomButton variant="primary" onClick={action} loading={loading}>
          Save
        </CustomButton>
      </Modal.Footer>
    </Modal>
  );
};

export default observer(ModalCategory);