import { utils, BigNumber } from 'ethers';
import Connector from 'containers/Connector';
import { useQuery } from 'react-query';
import Wei, { wei } from '@synthetixio/wei';

type AirdropRecord = {
	address: string;
	balance: Wei;
};

const useGetAirdropDataForAddress = () => {
	const { walletAddress } = Connector.useContainer();
	return useQuery<AirdropRecord | null>(
		['airdropRecord'],
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
				  }
				: null;
		},
		{
			enabled: !!walletAddress,
		}
	);
};

export default useGetAirdropDataForAddress;
