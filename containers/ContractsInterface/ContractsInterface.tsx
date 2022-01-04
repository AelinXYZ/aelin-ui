import { useEffect, useState, useMemo } from 'react';
import { Contract } from 'ethers';
import { createContainer } from 'unstated-next';

import PoolFactoryContract from './contracts/AelinPoolFactory';
import AelinStakingRewardsContract from './contracts/AelinStakingRewards';
import AelinEthStakingRewardsContract from './contracts/AelinEthStakingRewards';
import AelinTokenContract from './contracts/AelinToken';
import AelinEthLPTokenContract from './contracts/AelinEthLPToken';

import Connector from 'containers/Connector';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { getKeyValue } from 'utils/helpers';
import { StakingContracts } from './constants';

type AelinContracts = {
	AelinPoolFactory: Contract | null;
	AelinStaking: StakingContracts | null;
	AelinEthStaking: StakingContracts | null;
};

const useContractsInterface = () => {
	const { walletAddress, network, signer } = Connector.useContainer();
	const [contracts, setContracts] = useState<AelinContracts | null>(null);

	useEffect(() => {
		if (!walletAddress || !signer) return;

		try {
			const poolFactoryContract = (getKeyValue(PoolFactoryContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinStakingRewardsContract = (getKeyValue(AelinStakingRewardsContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinEthStakingRewardsContract = (getKeyValue(AelinEthStakingRewardsContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinTokenContract = (getKeyValue(AelinTokenContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const aelinEthLPTokenContract = (getKeyValue(AelinEthLPTokenContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);

			setContracts({
				AelinPoolFactory: new Contract(
					poolFactoryContract.address,
					poolFactoryContract.abi,
					signer
				),
				AelinStaking: {
					StakingContract: new Contract(
						aelinStakingRewardsContract.address,
						aelinStakingRewardsContract.abi,
						signer
					),
					TokenContract: new Contract(aelinTokenContract.address, aelinTokenContract.abi, signer),
				},
				AelinEthStaking: {
					StakingContract: new Contract(
						aelinEthStakingRewardsContract.address,
						aelinEthStakingRewardsContract.abi,
						signer
					),
					TokenContract: new Contract(
						aelinEthLPTokenContract.address,
						aelinEthLPTokenContract.abi,
						signer
					),
				},
			});
		} catch (e) {
			console.log('Could not find Aelin contracts for this network', e);
		}
	}, [walletAddress, network, signer]);

	return { contracts };
};

const ContractsInterface = createContainer(useContractsInterface);

export default ContractsInterface;
