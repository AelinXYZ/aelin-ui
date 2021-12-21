import { useQuery } from 'react-query';
import { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';
import DistributionContract from 'containers/ContractsInterface/contracts/AelinDistribution';
import { getKeyValue } from 'utils/helpers';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';

const useGetCanClaimForAddress = (index: number | null) => {
	const { network } = Connector.useContainer();
	return useQuery<boolean | null>(
		['airdrop', 'canClaim', index],
		async () => {
			const distributionContract = (getKeyValue(DistributionContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinDistribution = new ethers.Contract(
				distributionContract.address,
				distributionContract.abi
			);
			return await aelinDistribution.canClaim(wei(index).toBN());
		},
		{
			enabled: index !== null,
		}
	);
};

export default useGetCanClaimForAddress;
