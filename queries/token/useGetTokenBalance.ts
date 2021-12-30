import { useQuery } from 'react-query';
import Wei, { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';

const useGetTokenBalance = ({ tokenContract }: { tokenContract: ethers.Contract | null }) => {
	const { walletAddress, network } = Connector.useContainer();
	return useQuery<Wei | null>(
		['tokenBalance', tokenContract?.address, walletAddress, network?.id],
		async () => {
			try {
				const balance = await tokenContract?.balanceOf(walletAddress);
				return wei(balance);
			} catch (e) {
				console.log(e);
				return wei(0);
			}
		},
		{
			enabled: !!tokenContract && !!network && !!network.id && !!walletAddress,
		}
	);
};

export default useGetTokenBalance;
