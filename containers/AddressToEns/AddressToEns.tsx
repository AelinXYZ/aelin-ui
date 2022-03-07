import { utils, providers } from 'ethers';
import { createContainer } from 'unstated-next';
import { useState, useMemo, useEffect } from 'react';

import Connector from 'containers/Connector';

import { NetworkId } from 'constants/networks';
import { filterList } from 'constants/poolFilterList';

import { hasNonAsciiCharacters } from 'utils/string';

import useGetPoolsQuery, { parsePool } from 'queries/pools/useGetPoolsQuery';

interface AddressProps {
	[address: string]: string;
}

const useAddressesToEns = () => {
	const { network } = Connector.useContainer();
	const [ensNames, setEnsNames] = useState<AddressProps>({});

	const provider = useMemo(
		() =>
			new providers.InfuraProvider(NetworkId.Mainnet, process.env.NEXT_PUBLIC_INFURA_PROJECT_ID),
		[]
	);

	const poolsQuery = useGetPoolsQuery();

	const sponsors = useMemo(() => {
		if (poolsQuery.some((pools) => pools.isLoading)) return {};

		const pools = poolsQuery.map((pools) => (pools?.data ?? []).map(parsePool)).flat();

		return pools.reduce((accum: AddressProps, curr) => {
			if (accum[curr.sponsor]) return accum;
			if (filterList.includes(curr.id)) return accum;

			accum[curr.sponsor] = curr.sponsor;

			return accum;
		}, {});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(poolsQuery)]);

	useEffect(() => {
		const getEnsName = async (sponsors: AddressProps) => {
			if (Object.keys(sponsors).length) {
				const addresses = Object.values(sponsors);

				const areAddresses = addresses.map((sponsor) => utils.isAddress(sponsor)).every(Boolean);

				if (!areAddresses) return;

				const addressesToEns = await Promise.all(
					Object.keys(sponsors).map(async (address) => {
						const resolvedEnsName = await provider?.lookupAddress(address);

						if (!resolvedEnsName) return { [address]: address };

						const resolvedAddress = await provider?.resolveName(resolvedEnsName);
						// ENS does not enforce the accuracy of reverse records - for instance, anyone may claim that the name for their address is 'alice.eth'. To be certain that the claim is accurate, you must always perform a forward resolution for the returned name and check it matches the original address.
						if (resolvedAddress?.toLowerCase() !== address.toLowerCase()) return address;

						if (hasNonAsciiCharacters(resolvedEnsName)) return address;

						return { [address]: resolvedEnsName };
					})
				);

				setEnsNames(Object.assign({}, ...addressesToEns));
			}
		};

		getEnsName(sponsors);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(sponsors), setEnsNames, provider, network.id]);

	return { ensNames };
};

const AddressToEns = createContainer(useAddressesToEns);

export default AddressToEns;
