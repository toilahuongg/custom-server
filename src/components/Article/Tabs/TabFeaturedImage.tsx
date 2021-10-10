import React, { useMemo, useState } from 'react';
import useStore from '@src/stores';
import ModalImagePicker from '@src/components/Library/ModalImagePicker';
const TabFeaturedImage: React.FC = () => {
  const { article, library } = useStore();
  const { detailArticle } = article;
  const { images, getImageById } = library;
  const { featuredImage, setFeaturedImage } = detailArticle;
  const [isShow, setShow] = useState<boolean>(false);
  const toggleShow = () => setShow(!isShow);
  const [imagesSelected, setImageSelected] = useState([]);
  const urlFeaturedImage = useMemo(() => {
    const image = getImageById(featuredImage);
    return image?.url;
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
export default TabFeaturedImage;