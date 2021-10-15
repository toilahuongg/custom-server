import React from 'react';
import { Modal } from 'react-bootstrap';
import useStore from '../../stores';
import CustomButton from '../Layout/Button';

type TProps = {
  active: boolean
  toggleModal: () => void,
  action: () => void,
};
const ModalDeleteCategory: React.FC<TProps> = ({ active, toggleModal, action }) => {
  const { tag } = useStore();
  const { detailTag } = tag;
  const { title, loading } = detailTag;
  return (
    <Modal
      show={active}
      aria-labelledby="modal-remove-tag"
      centered
    >
      <Modal.Header onHide={toggleModal} closeButton>
        <Modal.Title id="modal-remove-tag">
          Delete Tag
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete <b> {title} </b>?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton variant="danger" onClick={action} loading={loading}>Delete</CustomButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalDeleteCategory;
