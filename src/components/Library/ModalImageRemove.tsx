import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import { useContext, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import CustomButton from '../Layout/Button';
import LibraryContext from './model';

const ModalImageRemove: React.FC = () => {
  const { image, isShowModalRemove, setShowModalRemove, removeImage } = useContext(LibraryContext);

  useEffect(() => {
    return () => applySnapshot(image, {});
  }, []);
  const fnRemove = async () => {
    try {
      image.setLoading(true);
      await removeImage(image._id);
      setShowModalRemove(false);
    } catch (error) {
      console.log(error);
    } finally {
      image.setLoading(false);
    }
  };
  return (
    <Modal show={isShowModalRemove} onHide={() => setShowModalRemove(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa ảnh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có muốn xóa ảnh này không ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowModalRemove(false)}> Close</Button>
        <CustomButton loading={image.loading} variant="danger" onClick={fnRemove}> Delete </CustomButton>
      </Modal.Footer>
    </Modal>
  );
};
export default observer(ModalImageRemove);