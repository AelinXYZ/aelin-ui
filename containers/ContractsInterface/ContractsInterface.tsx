import { useEffect, useState, useMemo } from 'react';
import { Contract } from 'ethers';
import { createContainer } from 'unstated-next';

import VAelinTokenContract from './contracts/vAelinToken';
import VAelinConverterContract from './contracts/VAelinConverter';
import PoolFactoryContract from './contracts/AelinPoolFactory';

import Connector from 'containers/Connector';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import { getKeyValue } from 'utils/helpers';
import { vAelinConverterContracts } from './constants';

type AelinContracts = {
	AelinPoolFactory: Contract | null;
	vAelinConverter: vAelinConverterContracts | null;
};

const useContractsInterface = () => {
	const { walletAddress, network, signer } = Connector.useContainer();
	const [contracts, setContracts] = useState<AelinContracts | null>(null);

	useEffect(() => {
		if (!walletAddress || !signer) {return;}

		try {
			const poolFactoryContract = (getKeyValue(PoolFactoryContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const vAelinTokenContract = (getKeyValue(VAelinTokenContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);
			const vAelinConverterContract = (getKeyValue(VAelinConverterContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);

			setContracts({
				AelinPoolFactory: new Contract(
					poolFactoryContract.address,
					poolFactoryContract.abi,
					signer
				),
				vAelinConverter: {
					VAelinTokenContract: new Contract(
						vAelinTokenContract.address,
						vAelinTokenContract.abi,
						signer
					),
					VAelinConverterContract: new Contract(
						vAelinConverterContract.address,
						vAelinConverterContract.abi,
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
