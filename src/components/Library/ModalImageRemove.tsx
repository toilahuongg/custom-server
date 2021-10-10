import {  useEffect } from 'react';
import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import { Button, Modal } from 'react-bootstrap';
import useStore from '@src/stores';
import CustomButton from '../Layout/Button';

const ModalImageRemove: React.FC = () => {
  const { library } = useStore();
  const { image, isShowModalRemove, setShowModalRemove, removeImage } = library;

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