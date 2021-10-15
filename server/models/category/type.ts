type TCategory = {
  _id?: string,
  title: string,
  description?: string,
  type: string,
  parent?: string,
  children?: [string],
  slug: string,
  index: number,
  createdAt?: string,
  updatedAt?: string,
};
export default TCategory;
