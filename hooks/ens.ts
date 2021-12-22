import { useMemo } from 'react';
import { utils, providers } from 'ethers';
import Connector from 'containers/Connector';
import { useEffect, useState } from 'react';
import { NetworkId } from 'constants/networks';

export const isEns = (x: string) => x.endsWith('.eth');
export const useEnsToAddress = (ensName: string) => {
	const { network } = Connector.useContainer();
	const [address, setAddress] = useState(ensName);
	const provider = useMemo(
		() =>
			new providers.InfuraProvider(NetworkId.Mainnet, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);

	useEffect(() => {
		const getAddress = async () => {
			if (!isEns(ensName)) return ensName;
			const address = await provider?.resolveName(ensName);
			setAddress(address || ensName);
		};
		getAddress();
	}, [ensName, provider, network.id]);
	return address;
};

export const useAddressToEns = (address: string) => {
	const { network } = Connector.useContainer();
	const provider = useMemo(
		() =>
			new providers.InfuraProvider(NetworkId.Mainnet, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);
	const [ensName, setEnsName] = useState(address);
	useEffect(() => {
		const getEnsName = async () => {
			if (!utils.isAddress(address)) return address;
			const resolvedEnsName = await provider?.lookupAddress(address);
			// ENS does not enforce the accuracy of reverse records - for instance, anyone may claim that the name for their address is 'alice.eth'. To be certain that the claim is accurate, you must always perform a forward resolution for the returned name and check it matches the original address.
			const resolvedAddress = resolvedEnsName
				? await provider?.resolveName(resolvedEnsName)
				: undefined;
			const validEnsName =
				resolvedAddress?.toLowerCase() === address.toLowerCase() ? resolvedEnsName : address;
			setEnsName(validEnsName || address);
		};
		getEnsName();
	}, [address, provider, network.id]);
	return ensName;
};
