import React from 'react';
import { Modal } from 'react-bootstrap';
import useStore from '../../../stores';
import CustomButton from '../Button';

type TProps = {
  active: boolean
  toggleModal: () => void,
  action: () => void,
};
const ModalDeleteArticle: React.FC<TProps> = ({ active, toggleModal, action }) => {
  const { article } = useStore();
  const { detailArticle } = article;
  const { title, loading } = detailArticle;
  return (
    <Modal
      show={active}
      aria-labelledby="modal-remove-article"
      centered
    >
      <Modal.Header onHide={toggleModal} closeButton>
        <Modal.Title id="modal-remove-article">
          Delete Article
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
export default ModalDeleteArticle;
