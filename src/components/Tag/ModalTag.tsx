import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import useStore from '../../stores';
import CustomButton from '../Layout/Button';
import FormTag from './FormTag';

type TProps = {
  title: string,
  action: () => Promise<void>;
};
const ModalTag: React.FC<TProps> = ({ title, action }) => {
  const { tag } = useStore();
  const { showModal, setShowModal, detailTag } = tag;
  const { loading } = detailTag;
  const fnCloseModal = () => {
    setShowModal(false);
    applySnapshot(detailTag, {});
  };
  return (
    <Modal show={showModal} size="lg" onHide={fnCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormTag />
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

export default observer(ModalTag);