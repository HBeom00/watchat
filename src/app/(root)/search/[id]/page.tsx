import SearchList from '@/components/search/SearchList';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div
      className={`flex flex-col w-[1060px] m-auto mt-[32px]
    mobile:w-[375px] mobile:px-[20px]`}
    >
      <SearchList search={params.id} />
    </div>
  );
};

export default page;
