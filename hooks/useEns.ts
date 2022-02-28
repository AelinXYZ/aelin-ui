import { useMemo, useEffect, useState } from 'react';
import { utils, providers } from 'ethers';

import Connector from 'containers/Connector';

import { NetworkId } from 'constants/networks';

import { hasNonAsciiCharacters, isEns } from 'utils/string';

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

export const useAddressesToEns = (addresses: string[]) => {
	const [ensNames, setEnsNames] = useState(addresses);
	const { network } = Connector.useContainer();

	const provider = useMemo(
		() =>
			new providers.InfuraProvider(NetworkId.Mainnet, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);

	useEffect(() => {
		const getEnsName = async () => {
			if (addresses?.length) {
				const areAddresses = addresses.map(utils.isAddress).every(Boolean);

				if (!areAddresses) return;

				const addressesToEns = await Promise.all(
					addresses.map(async (address) => {
						const resolvedEnsName = await provider?.lookupAddress(address);

						if (!resolvedEnsName) return address;

						const resolvedAddress = await provider?.resolveName(resolvedEnsName);
						// ENS does not enforce the accuracy of reverse records - for instance, anyone may claim that the name for their address is 'alice.eth'. To be certain that the claim is accurate, you must always perform a forward resolution for the returned name and check it matches the original address.
						if (resolvedAddress?.toLowerCase() !== address.toLowerCase()) return address;

						if (hasNonAsciiCharacters(resolvedEnsName)) return address;

						return resolvedEnsName;
					})
				);

				setEnsNames(addressesToEns);
			}
		};
		getEnsName();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(addresses), setEnsNames, provider, network.id]);

	return ensNames;
};
