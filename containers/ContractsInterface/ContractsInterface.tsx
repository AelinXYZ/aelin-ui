import { useEffect, useState, useMemo } from 'react';
import { Contract } from 'ethers';
import { createContainer } from 'unstated-next';

import Connector from 'containers/Connector';
import PoolFactoryContract from './contracts/AelinPoolFactory';

import { DEFAULT_NETWORK_ID } from 'constants/defaults';

type AelinContracts = {
	AelinPoolFactory: Contract | null;
};

const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];

const useContractsInterface = () => {
	const { walletAddress, network, signer } = Connector.useContainer();
	const [contracts, setContracts] = useState<AelinContracts | null>(null);

	useEffect(() => {
		if (!walletAddress || !signer) return;

		try {
			const poolFactoryContract = (getKeyValue(PoolFactoryContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);

			setContracts({
				AelinPoolFactory: new Contract(
					poolFactoryContract.address,
					poolFactoryContract.abi,
					signer
				),
			});
		} catch (e) {
			console.log('Could not find Aelin contracts for this network', e);
		}
	}, [walletAddress, network, signer]);

	return { contracts };
};

const ContractsInterface = createContainer(useContractsInterface);

export default ContractsInterface;
