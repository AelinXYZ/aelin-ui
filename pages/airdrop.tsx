import useGetAirdropDataForAddress from 'queries/airdrop/useGetAirdropDataForAddress';

const Airdrop = () => {
	const airdropQuery = useGetAirdropDataForAddress();
	const airdropData = airdropQuery?.data ?? null;

	console.log('tes', airdropData);
	return <div>airdrop</div>;
};

export default Airdrop;
