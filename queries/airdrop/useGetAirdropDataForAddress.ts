import Connector from 'containers/Connector';
import { useQuery } from 'react-query';
import { isMainnet, NetworkId } from 'constants/networks';

type AirdropRecord = {
	balance: string;
	index: number;
	proof: string[];
};

const useGetAirdropDataForAddress = () => {
	const { walletAddress, isOVM, network } = Connector.useContainer();
	const isOnMainnet = isMainnet(network?.id ?? NetworkId.Mainnet);

	return useQuery<AirdropRecord | null>(
		['airdrop', 'data', walletAddress, network?.id],
		async () => {
			if (walletAddress == null) {
				return null;
			}
			const request = await fetch('/data/dist-hashes.json');
			const airdropSource = await request.json();
			const claimAccounts = Object.keys(airdropSource.claims).map((e) => e.toLowerCase());
			const claimAccountsArr = Object.keys(airdropSource.claims).map((ele) => {
				return {
					address: ele.toLowerCase(),
					index: airdropSource.claims[ele]['index'],
					amount: airdropSource.claims[ele]['amount'],
					proof: airdropSource.claims[ele]['proof'],
				};
			});
			if (claimAccounts.includes(walletAddress)) {
				return {
					proof: claimAccountsArr[claimAccounts.indexOf(walletAddress)].proof, //get the proof
					index: claimAccountsArr[claimAccounts.indexOf(walletAddress)].index, //get the index
					balance: claimAccountsArr[claimAccounts.indexOf(walletAddress)].amount, //get the airdrop amount
				};
			}
			return null;
		},
		{
			enabled: !!walletAddress && isOVM && isOnMainnet,
		}
	);
};

export default useGetAirdropDataForAddress;
