import { useQuery } from 'react-query';
import Wei, { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';

type StakingRewardsData = {
	balance: Wei;
	earned: Wei;
};

const useGetStakingRewardsDataForAddress = ({
	stakingRewardsContract,
}: {
	stakingRewardsContract: ethers.Contract | null;
}) => {
	const { walletAddress, network } = Connector.useContainer();
	return useQuery<StakingRewardsData | null>(
		['stakingRewardsDataForAddress', stakingRewardsContract?.address, walletAddress, network?.id],
		async () => {
			try {
				const [balance, earned] = await Promise.all([
					stakingRewardsContract?.balanceOf(walletAddress),
					stakingRewardsContract?.earned(walletAddress),
				]);
				return {
					balance: wei(balance),
					earned: wei(earned),
				};
			} catch (e) {
				console.log(e);
				return null;
			}
		},
		{
			enabled: !!stakingRewardsContract && !!network && !!network.id && !!walletAddress,
		}
	);
};

export default useGetStakingRewardsDataForAddress;
