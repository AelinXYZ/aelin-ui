import Connector from 'containers/Connector';
import { erc20Abi } from 'contracts/erc20';
import { ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import { truncateAddress, getERC20Data } from 'utils/crypto';

type TokenProps = { symbol?: string; address: string; displayAddress?: boolean };

const TokenDisplay: FC<TokenProps> = (props) => {
	const { provider } = Connector.useContainer();
	const [resolvedSymbol, setResolvedSymbol] = useState('');
	const { address, displayAddress } = props;
	const symbol = 'symbol' in props ? props.symbol : undefined;
	useEffect(() => {
		if (symbol) return;
		if (!address) return;

		let mounted = true;
		const getSymbol = async () => {
			const { symbol } = await getERC20Data({ address, provider });
			if (mounted) setResolvedSymbol(symbol);
		};
		getSymbol();
		return () => {
			mounted = false;
		};
	}, [address, provider, symbol]);
	if (!address) return <>-</>;
	return (
		<>
			{symbol || resolvedSymbol} {displayAddress ? `(${truncateAddress(address)})` : ''}
		</>
	);
};
export default TokenDisplay;
