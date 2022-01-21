import { useQuery } from 'react-query';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';
import SecondDistributionContract from 'containers/ContractsInterface/contracts/SecondAelinDistribution';
import { getKeyValue } from 'utils/helpers';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { isMainnet, NetworkId } from 'constants/networks';

const useGetAddressCanClaimMerkle = (index: number | null) => {
	const { network, provider, walletAddress, isOVM } = Connector.useContainer();
	const isOnMainnet = isMainnet(network?.id ?? NetworkId['Optimism-Mainnet']);
	return useQuery<boolean | null>(
		['merkle', 'canClaim', index, walletAddress, network?.id],
		async () => {
			const distributionContract = (getKeyValue(SecondDistributionContract) as any)(
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

export default useGetAddressCanClaimMerkle;
