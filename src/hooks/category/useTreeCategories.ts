import { makeid } from '@src/helper/common';
import { ICategoryModelOut } from '@src/stores/category';
import { useEffect, useMemo, useState } from 'react';
import useStore from '../../stores';
type TCategory = ICategoryModelOut & { prefix?: string };

export const useTreeCategories = (t: string, id: string = null) => {
  const { category } = useStore();
  const { getListCategory, countCategory, getCategories } = category;
  const [isLoading, setLoading] = useState(true);
  const [keyChangeCategory, setKeyChangeCategory] = useState('');
  const [treeCategory, setTreeCategory] = useState<TCategory[]>([]);
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await getCategories();
        setKeyChangeCategory(makeid(8));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (countCategory() === 0) {
      run();
    } else {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const list = getListCategory();
    const categoryParent = list.filter(({ parent, type }) => !parent && type === t);
    const result: TCategory[] = [];
    const recursive = async (categories: TCategory[], prefix = null) => {
      for (const cat of categories ) {
        if (!id || cat._id !== id) result.push({
          ...cat,
          prefix,
        });
        await recursive(list.filter(({ parent }) => parent === cat._id), prefix ? prefix + prefix : '──');
      }
    };
    const run = async () => {
      setLoading(true);
      await recursive(categoryParent);
      setTreeCategory(result);
      setLoading(false);
    };
    run();
  }, [keyChangeCategory]);
  return useMemo(() => ({ treeCategory, isLoading, setKeyChangeCategory }), [treeCategory, isLoading, keyChangeCategory]);
};
