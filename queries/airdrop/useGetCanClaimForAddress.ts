import { useQuery } from 'react-query';
import { wei } from '@synthetixio/wei';

import ContractsInterface from 'containers/ContractsInterface';

const useGetCanClaimForAddress = (index: number | null) => {
	const { contracts } = ContractsInterface.useContainer();
	return useQuery<boolean | null>(
		['airdrop', 'canClaim', index],
		async () => {
			return await contracts?.AelinDistribution?.canClaim(wei(index).toBN());
		},
		{
			enabled: index !== null && !!contracts && !!contracts.AelinDistribution,
		}
	);
};

export default useGetCanClaimForAddress;
