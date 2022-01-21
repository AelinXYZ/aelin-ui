import Connector from 'containers/Connector';
import { useQuery } from 'react-query';
import { isMainnet, NetworkId } from 'constants/networks';

type MerkleRecord = {
	balance: string;
	index: number;
	proof: string[];
};

const useGetMerkleDataForAddress = () => {
	const { walletAddress, isOVM, network } = Connector.useContainer();
	const isOnMainnet = isMainnet(network?.id ?? NetworkId['Optimism-Mainnet']);

	return useQuery<MerkleRecord | null>(
		['merkle', 'data', walletAddress, network?.id],
		async () => {
			if (walletAddress == null) {
				return null;
			}
			const request = await fetch('/data/second-dist-hashes.json');
			const merkleSource = await request.json();
			const claimAccounts = Object.keys(merkleSource.claims).map((e) => e.toLowerCase());
			const claimAccountsArr = Object.keys(merkleSource.claims).map((ele) => {
				return {
					address: ele.toLowerCase(),
					index: merkleSource.claims[ele]['index'],
					amount: merkleSource.claims[ele]['amount'],
					proof: merkleSource.claims[ele]['proof'],
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

export default useGetMerkleDataForAddress;
