import { useQuery } from 'react-query';
import Wei, { wei } from '@synthetixio/wei';
import { ethers } from 'ethers';

import Connector from 'containers/Connector';

const ONE_YEAR = 365 * 24 * 3600;

type StakingRewardsData = {
	apy: number;
	aelin: number;
};

const useGetStakingRewardsAPY = ({
	stakingRewardsContract,
	tokenContract,
}: {
	stakingRewardsContract: ethers.Contract | null;
	tokenContract: ethers.Contract | null;
}) => {
	const { network } = Connector.useContainer();
	return useQuery<StakingRewardsData | null>(
		['stakingRewardsAPY', stakingRewardsContract?.address, tokenContract?.address, network?.id],
		async () => {
			try {
				const [rewardForDuration, duration, contractBalance] = await Promise.all([
					stakingRewardsContract?.getRewardForDuration(),
					stakingRewardsContract?.rewardsDuration(),
					tokenContract?.balanceOf(stakingRewardsContract?.address),
				]);

				const yearProRata = ONE_YEAR / Number(duration);
				return {
					aelin: contractBalance / 1e18,
					apy: (100 * ((rewardForDuration / 1e18) * yearProRata)) / (contractBalance / 1e18),
				};
			} catch (e) {
				console.log(e);
				return null;
			}
		},
		{
			enabled: !!stakingRewardsContract && !!network && !!network.id && !!tokenContract,
		}
	);
};

export default useGetStakingRewardsAPY;
