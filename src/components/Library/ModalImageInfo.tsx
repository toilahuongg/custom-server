import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { applySnapshot } from 'mobx-state-tree';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import useStore from '../../stores';
import styles from './library.module.scss';

const ModalImageInfo: React.FC = () => {
  const { library } = useStore();
  const { image, isShowModalInfo, setShowModalInfo } = library;
  const {
    url, type, size, height, width, 
  } = image;
  console.log(url);
  useEffect(() => {
    return () => applySnapshot(image, {});
  }, []);
  return (
    <Modal fullscreen show={isShowModalInfo} onHide={() => setShowModalInfo(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={8}>
            <img src={url} className="img-fuild" alt="" />
          </Col>
          <Col sm={4}>
            <h3>Thông tin</h3>
            <ul className={styles.infoImage}>
              <li>Url: {url}</li>
              <li>Type: {type}</li>
              <li>Kích thước: {width}x{height}</li>
              <li>Size: {size}</li>
              <li>Ngày tải: </li>
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowModalInfo(false)}> Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default observer(ModalImageInfo);