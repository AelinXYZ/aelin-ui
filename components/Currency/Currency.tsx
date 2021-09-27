import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import sUSDIcon from 'assets/svg/currency/susd.svg';
import USDCIcon from 'assets/svg/currency/usdc.svg';
import USDTIcon from 'assets/svg/currency/usdt.svg';

export enum PoolCurrency {
	sUSD = 'sUSD',
	USDC = 'USDC',
	USDT = 'USDT',
}

type CurrencyProps = {
	ticker: PoolCurrency;
};

const getCurrencyIcon = (ticker: PoolCurrency) => {
	switch (ticker) {
		case PoolCurrency.USDC:
			return USDCIcon;
		case PoolCurrency.sUSD:
			return sUSDIcon;
		case PoolCurrency.USDT:
			return USDTIcon;
	}
};

const Currency: FC<CurrencyProps> = ({ ticker }) => {
	return (
		<Container>
			<Image src={getCurrencyIcon(ticker)} alt={`${ticker} icon`} />
			<Ticker>{ticker}</Ticker>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const Ticker = styled.span`
	margin: 4px 0 0 6px;
`;

export default Currency;
