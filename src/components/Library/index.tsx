import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import LibraryContext from './model';
import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import instance from '@src/helper/instance';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import styles from './library.module.scss';
import { fileSize, getImage } from '@src/helper/common';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = { borderColor: '#2196f3' };

const acceptStyle = { borderColor: '#00e676' };

const rejectStyle = { borderColor: '#ff1744' };

const LibraryLayout: React.FC = () => {
  const {
    images, addToWait, updateProgress, updateFromWaitToImage, getImages, 
  } = useContext(LibraryContext);
  const onDrop = useCallback(async (acceptedFiles) => {
    const files = acceptedFiles.map((file: File) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      const wait = {
        _id: nanoid(),
        status: 'uploading',
        url: objectUrl,
        size: fileSize(file.size),
      };
      addToWait(wait);
      return {
        file,
        ...wait,
      };
    });
    for (const f of files) {
      console.log(getSnapshot(images));
      let data = new FormData();
      const infoImage = await getImage(f.file);
      const { width, height, size } = infoImage;
      data.append('file', f.file);
      data.append('width', width);
      data.append('height', height);
      data.append('size', size);
      await instance.post('/library', data, {
        onUploadProgress: (progressEvent) => {
          const process = Math.floor(progressEvent.loaded / progressEvent.total) * 100;
          updateProgress(f._id, process);
        }, 
      }).then((res) => {
        updateFromWaitToImage(f._id, {
          ...res.data,
          status: 'finish',
        });
      });
    }
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
  } = useDropzone({ accept: 'image/*', onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept,
  ]);

  useEffect(() => {
    const run = async () => {
      await getImages({ page: 1, limit: 12 });
    };
    run();
  }, []);

  return (
  <>
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      
    </div>
    <br />
    <Row>
      {images.map(img => img?._id && (
    <Col key={img._id} sm="6" md="3" lg="2">
      <div className={styles.item}>
        <img src={img.url} alt="" />
        <div className={styles.bg} style={{ visibility: (img.status === 'uploading' ? 'visible' : 'hidden' ) }}>
          <div className={styles.size}> {img.size} </div>
          <ProgressBar animated now={img.progress} label={`${img.progress}%`}/>
        </div>
      </div>
    </Col>
      ))}
    </Row>
  </>
  );
};

export default observer(LibraryLayout);