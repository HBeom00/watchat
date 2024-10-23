import PartyHeader from "./(components)/PartyHeader";
import DetailInfo from "./(components)/DetailInfo";

const partyPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyNumber={params.id} />
      <DetailInfo partyNumber={params.id} />
    </div>
  );
};

export default partyPage;
