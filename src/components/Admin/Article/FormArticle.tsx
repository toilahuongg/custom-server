import React from 'react';
import { observer } from 'mobx-react';
import Editor from 'rich-markdown-editor';
import useStore from '../../../stores';
import styles from './article.module.scss';

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
  keyEditor?: string,
};
const FormArticle: React.FC<TProps> = ({ keyEditor }) => {
  const { article } = useStore();
  const { detailArticle } = article;
  const { title, content, setTitle, setContent } = detailArticle;
  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>
        <input type="text" placeholder="Title...." value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.formContent}>
        <Editor
          key={keyEditor}
          defaultValue={content}
          onSave={(options) => console.log('Save triggered', options)}
          onCancel={() => console.log('Cancel triggered')}
          uploadImage={(file) => {
            console.log('File upload triggered: ', file);

            // Delay to simulate time taken to upload
            return new Promise((resolve) => {
              setTimeout(
                () => resolve('https://loremflickr.com/1000/1000'),
                1500,
              );
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
          onChange={(value) => setContent(value())}
        />
      </div>
    </div>
  );
};
export default observer(FormArticle);
