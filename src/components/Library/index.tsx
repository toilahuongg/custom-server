import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import LazyLoad from 'react-lazyload';
import LibraryContext from './model';
import instance from '@src/helper/instance';
import styles from './library.module.scss';
import { fileSize, getImage } from '@src/helper/common';
import { Clipboard, InfoLg, Trash } from 'react-bootstrap-icons';

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
      await getImages({ page: 1, limit: 100 });
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
        <LazyLoad height={250}>
          <img src={img.url} alt="" />
        </LazyLoad>
        <div className={styles.coatingUploading} style={{ visibility: (img.status === 'uploading' ? 'visible' : 'hidden' ) }}>
          <div className={styles.size}> {img.size} </div>
          <ProgressBar animated now={img.progress} label={`${img.progress}%`}/>
        </div>
        <div className={styles.coatingEffect} style={{ visibility: (img.status === 'uploading' ? 'hidden' : 'visible' ) }}>
          <div className={styles.actions}>
            <button className={styles.btnInfo}> <InfoLg /> </button>
            <button className={styles.btnCopy}> <Clipboard /> </button>
            <button className={styles.btnRemove}> <Trash /> </button>
          </div>
        </div>
      </div>
    </Col>
      ))}
    </Row>
  </>
  );
};

export default observer(LibraryLayout);