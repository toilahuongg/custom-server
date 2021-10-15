type TArticle = {
  _id: string,
  title: string,
  description: string,
  featuredImage: string,
  content: string,
  slug: string,
  index: string,
  categories: string[],
  tags: string[],
  createdAt: string,
  updatedAt: string,
};
export default TArticle;
