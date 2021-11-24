import Connector from 'containers/Connector';
import { erc20Abi } from 'contracts/erc20';
import { ethers } from 'ethers';
import { FC, useEffect, useState } from 'react';
import { truncateAddress } from 'utils/crypto';

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
			const contract = new ethers.Contract(address, erc20Abi, provider);
			const symbol = await contract.symbol();
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
