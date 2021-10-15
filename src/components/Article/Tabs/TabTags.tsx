import { observer } from 'mobx-react';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { useTags } from '@src/hooks';
import useStore from '@src/stores';
import { getSnapshot } from 'mobx-state-tree';
export interface IOption {
  value: string;
  label: string;
  __isNew__?: boolean;
}

const TabTags: React.FC = () => {
  const { tag, article } = useStore();
  const { detailArticle } = article;
  const { detailTag, actionTag } = tag;
  const { tags: listTag } = useTags('article');
  const options: IOption[] = listTag.map((tag) => ({
    label: tag.title,
    value: tag._id,
  }));
  const value = options.filter(({ value }) => detailArticle.tags.includes(value));
  const handleChange = async (
    newValue: OnChangeValue<IOption, true>,
    actionMeta: ActionMeta<IOption>,
  ) => {
    const data = newValue.filter(({ __isNew__ }) => !__isNew__).map(({ value }) => value);
    if (actionMeta.action === 'create-option') {
      const val = newValue.find(({ __isNew__ }) => __isNew__);
      detailTag.setTitle(val.label);
      detailTag.setType('article');
      const res = await actionTag();
      data.push(res._id);
    }
    detailArticle.setTags(data);
  };
  return (
    <CreatableSelect
      value={value}
      isMulti
      options={options}
      onChange={handleChange}
    />
  );
};

export default observer(TabTags);