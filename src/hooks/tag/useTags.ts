import useStore from '@src/stores';
import { useEffect, useState } from 'react';

export const useTags = (type: string) => {
  const { tag } = useStore();
  const { countTag, getTags, getTagByType } = tag;
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await getTags();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (countTag() === 0)
      run();
    else setLoading(false);
  }, []);
  return { tags: getTagByType(type), isLoading };
};