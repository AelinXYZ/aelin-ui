import { isAddress } from '@ethersproject/address';
import Connector from 'containers/Connector';
import { useEffect, useState } from 'react';
import { NetworkId } from 'constants/networks';

export const isEns = (x: string) => x.endsWith('.eth');
export const useEnsToAddress = (ensName: string) => {
	const { provider, network } = Connector.useContainer();
	const [address, setAddress] = useState(ensName);
	useEffect(() => {
		const getAddress = async () => {
			if (!isEns(ensName) || network.id !== NetworkId.Mainnet) return ensName;
			const address = await provider?.resolveName(ensName);
			setAddress(address || ensName);
		};
		getAddress();
	}, [ensName, provider, network.id]);
	return address;
};

export const useAddressToEns = (address: string) => {
	const { provider, network } = Connector.useContainer();
	const [ensName, setEnsName] = useState(address);
	useEffect(() => {
		const getEnsName = async () => {
			if (!isAddress(address) || network.id !== NetworkId.Mainnet) return address;
			const resolvedEnsName = await provider?.lookupAddress(address);
			// ENS does not enforce the accuracy of reverse records - for instance, anyone may claim that the name for their address is 'alice.eth'. To be certain that the claim is accurate, you must always perform a forward resolution for the returned name and check it matches the original address.
			const resolvedAddress = resolvedEnsName
				? await provider?.resolveName(resolvedEnsName)
				: undefined;
			const validEnsName =
				resolvedAddress?.toLowerCase() === address.toLowerCase() ? resolvedEnsName : address;
			console.log({ resolvedEnsName, resolvedAddress, validEnsName });
			setEnsName(validEnsName || address);
		};
		getEnsName();
	}, [address, provider, network.id]);
	return ensName;
};
