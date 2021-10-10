import { fileSize, getImage } from '@src/helper/common';
import instance from '@src/helper/instance';
import useStore from '@src/stores';
import { nanoid } from 'nanoid';
import React from 'react';
import RichMarkdownEditor from 'rich-markdown-editor';
import light from 'rich-markdown-editor/dist/theme';


const YoutubeEmbed = ({ attrs }) => {
  const videoId = attrs.matches[1];

  return (
    <iframe
      title="youtube"
      src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
    />
  );
};

type TProps = {
  keyEditor?: string;
  content: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
};

const Editor: React.FC<TProps> = ({ keyEditor, content, readOnly, onChange }) => {
  const { library } = useStore(); 
  const { addToWait, updateFromWaitToImage, updateProgress } = library;
  return (
    <RichMarkdownEditor
      key={keyEditor}
      defaultValue={content}
      onSave={(options) => console.log('Save triggered', options)}
      onCancel={() => console.log('Cancel triggered')}
      theme={
       {
         ...light,
         code: '#e6c07b',
         codeKeyword: '#c678dd',
         codeBackground: '#011626',
         codeString: '#fff',
         codeFunction: '#61aeee',
         codeProperty: '#abb2bf',
       }
      }
      readOnly={readOnly}
      // disableExtensions={['image']}
      onImageUploadStart={() => console.log('helllo')}
      uploadImage={(file) => {
        const objectUrl = URL.createObjectURL(file);
        const wait = {
          _id: nanoid(),
          status: 'uploading',
          url: objectUrl,
          size: fileSize(file.size),
        };
        addToWait(wait);
        // Delay to simulate time taken to upload
        return new Promise(async (resolve) => {
          let data = new FormData();
          const infoImage = await getImage(file);
          const { width, height, size } = infoImage;
          data.append('file', file);
          data.append('width', width);
          data.append('height', height);
          data.append('size', size);
          await instance.post('/library', data, {
            onUploadProgress: (progressEvent) => {
              const process = Math.floor(progressEvent.loaded / progressEvent.total) * 100;
              updateProgress(wait._id, process);
            }, 
          }).then((res) => {
            updateFromWaitToImage(wait._id, { ...res.data[0], status: 'finish' });
            resolve(res.data[0].url);
          });
        });
      }}
      embeds={[
        {
          title: 'YouTube',
          keywords: 'youtube video tube google',
          icon: () => (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
              width={24}
              height={24}
              alt="x"
            />
          ),
          matcher: (url) => {
            return url.match(
              /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i,
            );
          },
          component: YoutubeEmbed,
        },
      ]}
      autoFocus
      onChange={(value) => onChange(value())}
    />
  );
};

export default Editor;