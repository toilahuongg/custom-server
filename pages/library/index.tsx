import AdminLayout from '@src/components/AdminLayout';
import LibraryLayout from '@src/components/Library';

const LibraryPage: React.FC = () => {

  return (
    <AdminLayout title="Library">
      <LibraryLayout />
    </AdminLayout>
  );
};
export default LibraryPage;