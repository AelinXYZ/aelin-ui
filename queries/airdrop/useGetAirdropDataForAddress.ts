import { utils, BigNumber } from 'ethers';
import Connector from 'containers/Connector';
import { useQuery } from 'react-query';
import Wei, { wei } from '@synthetixio/wei';
import { isMainnet, NetworkId } from 'constants/networks';

type AirdropRecord = {
	address: string;
	balance: Wei;
	index: number;
	proof: string[];
};

const useGetAirdropDataForAddress = () => {
	const { walletAddress, isOVM, network } = Connector.useContainer();
	const isOnMainnet = isMainnet(network?.id ?? NetworkId.Mainnet);

	return useQuery<AirdropRecord | null>(
		['airdrop', 'data', walletAddress, network?.id],
		async () => {
			const request = await fetch('/data/airdrop.json');
			const airdropSource = await request.json();
			const match = airdropSource.find(
				({ address }: { address: string }) =>
					utils.getAddress(address) === utils.getAddress(walletAddress ?? '')
			);
			return match
				? {
						address: match.address,
						balance: wei(BigNumber.from(match.balance)),
						index: Number(match.index),
						proof: match.proof,
				  }
				: null;
		},
		{
			enabled: !!walletAddress && isOVM && isOnMainnet,
		}
	);
};

export default useGetAirdropDataForAddress;
