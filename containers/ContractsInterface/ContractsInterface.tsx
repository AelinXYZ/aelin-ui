import { useEffect, useState, useMemo } from 'react';
import { Contract } from 'ethers';
import { createContainer } from 'unstated-next';

import Connector from 'containers/Connector';
import PoolFactoryContract from './contracts/AelinPoolFactory';
import PoolContract from './contracts/AelinPool';
import useGetPoolsQuery, { parsePools } from 'queries/pools/useGetPoolsQuery';

// import { chainIdMapping, NetworkId, Network as NetworkName, NetworkType } from 'constants/networks';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';

type AelinContracts = {
	AelinPoolFactory: Contract | null;
	AelinPools: Record<string, Contract> | null;
};

const getKeyValue =
	<T extends object, U extends keyof T>(obj: T) =>
	(key: U) =>
		obj[key];

const useContractsInterface = () => {
	const { walletAddress, network, signer } = Connector.useContainer();
	const [contracts, setContracts] = useState<AelinContracts | null>(null);
	const poolsQuery = useGetPoolsQuery();
	const pools = useMemo(() => parsePools(poolsQuery?.data), [poolsQuery?.data]);
	console.log('pools', pools);

	useEffect(() => {
		if (!walletAddress || !signer) return;

		try {
			const poolFactoryContract = (getKeyValue(PoolFactoryContract) as any)(
				network?.id ?? DEFAULT_NETWORK_ID
			);

			let poolContracts: Record<string, Contract> = {};
			if (pools && pools.length > 0) {
				pools.forEach(({ address }) => {
					poolContracts[address] = new Contract(address, PoolContract.abi, signer);
				});
			}

			setContracts({
				AelinPoolFactory: new Contract(
					poolFactoryContract.address,
					poolFactoryContract.abi,
					signer
				),
				AelinPools: poolContracts,
			});
		} catch (e) {
			console.log('Could not find Aelin contracts for this network', e);
		}
	}, [walletAddress, network, signer, pools]);

	return { contracts };
};

const ContractsInterface = createContainer(useContractsInterface);

export default ContractsInterface;
