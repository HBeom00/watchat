import SearchList from '@/components/home/SearchList';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="w-[1060px] m-auto">
      <SearchList search={params.id} />
    </div>
  );
};

export default page;
