import { useEffect, useState } from 'react';

import Connector from 'containers/Connector';

import { getERC20Data } from 'utils/crypto';

const useAddressesToSymbols = (addresses: string[]) => {
	const { provider } = Connector.useContainer();

	const [symbols, setSymbols] = useState<string[]>([]);

	useEffect(() => {
		if (!addresses) {return;}

		const getSymbols = async (addresses: string[]) => {
			const symbols: string[] = await Promise.all(
				addresses.map(async (address: string) => {
					const { symbol } = await getERC20Data({ address, provider });

					return symbol ? symbol : '';
				})
			);

			setSymbols(symbols);
		};

		getSymbols(addresses);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(addresses), provider]);

	return symbols;
};

export default useAddressesToSymbols;
