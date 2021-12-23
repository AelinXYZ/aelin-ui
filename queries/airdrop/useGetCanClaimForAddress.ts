import { useQuery } from 'react-query';
import { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';
import DistributionContract from 'containers/ContractsInterface/contracts/AelinDistribution';
import { getKeyValue } from 'utils/helpers';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { isMainnet, NetworkId } from 'constants/networks';

const useGetCanClaimForAddress = (index: number | null) => {
	const { network, provider, walletAddress, isOVM } = Connector.useContainer();
	const isOnMainnet = isMainnet(network?.id ?? NetworkId.Mainnet);
	return useQuery<boolean | null>(
		['airdrop', 'canClaim', index, walletAddress, network?.id],
		async () => {
			const distributionContract = (getKeyValue(DistributionContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinDistribution = new ethers.Contract(
				distributionContract.address,
				distributionContract.abi,
				provider
			);
			const response = await aelinDistribution.isClaimed(index);
			return !response;
		},
		{
			enabled:
				index !== null &&
				!!network &&
				!!provider &&
				!!walletAddress &&
				!!network?.id &&
				isOVM &&
				isOnMainnet,
		}
	);
};

export default useGetCanClaimForAddress;
