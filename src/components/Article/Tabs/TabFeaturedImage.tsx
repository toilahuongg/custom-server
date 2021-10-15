import React, { useEffect, useState } from 'react';
import useStore from '@src/stores';
import ModalImagePicker from '@src/components/Library/ModalImagePicker';
import { observer } from 'mobx-react';
import instance from '@src/helper/instance';
const TabFeaturedImage: React.FC = () => {
  const { article, library } = useStore();
  const { detailArticle } = article;
  const { images, getImageById } = library;
  const { featuredImage, setFeaturedImage } = detailArticle;
  const [isShow, setShow] = useState<boolean>(false);
  const toggleShow = () => setShow(!isShow);
  const [imagesSelected, setImageSelected] = useState([]);
  const [urlFeaturedImage, setUrlFeaturedImage] = useState('');
  useEffect(() => {
    const run = async () => {
      try {
        if (images.length == 0) {
          const response = await instance.get(`/library/${featuredImage}`);
          setUrlFeaturedImage(response.data[0]?.url || '');
        } else {
          const image = getImageById(featuredImage);
          setUrlFeaturedImage(image?.url || '');
        }
      } catch (error) {
        console.log(error);
      }
    };
    run();
  }, [featuredImage, images.length]);
  return (
    <>
      <div className="choose-image" onClick={toggleShow} style={{ height: '200px' }}>
        <div className="none">
          Choose image
        </div>
        {
          urlFeaturedImage && (
            <>
              <img src={urlFeaturedImage} alt="" />
              <div className="has"> Choose image </div>
            </>
          )
        }
      </div>

      <ModalImagePicker isShow={isShow} imagesSelected={imagesSelected} onClose={toggleShow} onChange={(image) => {
        if (imagesSelected.includes(image)) {
          setImageSelected([]);
          setFeaturedImage('');
        } else {
          setImageSelected([image]);
          setFeaturedImage(image);
        }
      }} />
    </>
  );
};
export default observer(TabFeaturedImage);