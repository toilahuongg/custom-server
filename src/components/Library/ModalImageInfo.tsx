import { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import LibraryContext from './model';

const ModalImageInfo: React.FC = () => {
  const { isShowModalInfo, setShowModalInfo } = useContext(LibraryContext);
  return (
    <Modal show={isShowModalInfo} size="lg" onHide={() => setShowModalInfo(false)}>
      hellllo
    </Modal>
  );
};
export default ModalImageInfo;