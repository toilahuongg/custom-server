import Head from 'next/head';

type TProps = {
  title: string
};
const CustomHead: React.FC<TProps> = ({ title }) => {
  return (
    <Head>
      <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
      <title> {title} | Tôi Là Hướng </title>
    </Head>
  );
};
export default CustomHead;
