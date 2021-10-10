import React from 'react';
import { Modal } from 'react-bootstrap';
import LibraryLayout from './index';
type TProps = {
  isShow: boolean;
  imagesSelected: string[];
  onClose: () => void;
  onChange: (img: string) => void;
};
const ModalImagePicker: React.FC<TProps> = ({ isShow,  imagesSelected, onClose, onChange }) => {
  return (
    <Modal size="xl" show={isShow} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Library</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LibraryLayout isPicker imagesSelected={imagesSelected} onChange={onChange} />
      </Modal.Body>
      
    </Modal>
  );
};
export default ModalImagePicker;