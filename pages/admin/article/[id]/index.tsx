import axios from 'axios';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { IArticleModelOut } from '../../../../src/stores/article';

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get('http://localhost:3000/api/article');
  const paths = response.data.map((article: IArticleModelOut) => ({ params: { id: article._id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;
  const { id } = params;
  const response = await axios.get(`http://localhost:3000/api/article/${id}`);
  return { props: { item: response.data }, revalidate: 10 };
};

const ShowArticlePage = () => {
  return <h1> helllo </h1>;
};
export default ShowArticlePage;
