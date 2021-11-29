import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Wei, { wei } from "@synthetixio/wei";

import { Tooltip } from 'components/common';
import Connector from 'containers/Connector';

import useExchangeRatesQuery from 'hooks/useExchangeRatesQuery';
import useEthGasPriceQuery, { GAS_SPEEDS } from 'hooks/useEthGasPriceQuery';

import { getExchangeRatesForCurrencies } from 'utils/currencies';
import { getTransactionPrice } from 'utils/network';

import { GWEI_PRECISION } from 'constants/networks';

import { IGasSelector, GasSpeed, GasPrices } from './types';

const GasSelector: React.FC<IGasSelector> = ({ setGasPrice, gasLimitEstimate, initialGasSpeed = 'fast' }) => {
	const [customGasPrice, setCustomGasPrice] = useState<string>('');
	const [gasSpeed, setGasSpeed] = useState<GasSpeed>(initialGasSpeed);
	const [isOpen, setIsOpen] = useState(false);

	const { network, provider } = Connector.useContainer();

	const exchangeRatesQuery = useExchangeRatesQuery(network);
	const ethGasStationQuery = useEthGasPriceQuery({ networkId: network.id, provider });

	const gasPrices = ethGasStationQuery.data ?? ({} as GasPrices);
	const exchangeRates = exchangeRatesQuery.data ?? null;
	
	const gasPrice: Wei | null = useMemo(() => {
		try {
			return wei(customGasPrice, GWEI_PRECISION);
		} catch (_) {
			if (!ethGasStationQuery.data) return null;

			return wei(ethGasStationQuery.data[gasSpeed], GWEI_PRECISION);
		}
	}, [customGasPrice, ethGasStationQuery.data, gasSpeed]);

	const ethPriceRate = getExchangeRatesForCurrencies(
		exchangeRates,
		'sETH',
		'sUSD'
	);
	
	const transactionFee = useMemo(
		() => getTransactionPrice(gasPrice, gasLimitEstimate, ethPriceRate) ?? 0,
		[gasPrice, gasLimitEstimate, ethPriceRate]
	);

	const formattedGasPrice = useMemo(() => {
		const nGasPrice = Number(gasPrices[gasSpeed] ?? 0);
		const nCustomGasPrice = Number(customGasPrice);

		if(!nCustomGasPrice) {
			if (!Number.isInteger(nGasPrice)) return nGasPrice.toFixed(2);
			return nGasPrice
		}

		if (!Number.isInteger(nCustomGasPrice)) return nCustomGasPrice.toFixed(2);
		return nCustomGasPrice;
	}, [customGasPrice, gasPrices[gasSpeed]]);

	useEffect(() => {
		try {
			setGasPrice(wei(customGasPrice, GWEI_PRECISION));
		} catch (_) {
			setGasPrice(gasPrice || wei(0));
		}
		// eslint-disable-next-line
	}, [gasPrice, customGasPrice]);

	return (
		<StyledContainer>
			<StyledGasDescription>
				{`GAS PRICE (GWEI): `} 
			</StyledGasDescription>
			<span>
				<StyledGasPrice>
					{`≈${formattedGasPrice} ($${transactionFee})`}
				</StyledGasPrice>
				<EditGasEstimateTooltip
					visible={isOpen}
					appendTo="parent"
					trigger="click"
					allowHTML
					interactive
					content={
						<StyledUl>
							<StyledLi>
								<StyledInput
									type="number"
									value={customGasPrice}
									placeholder="Custom"
									onChange={(e) => {
										setCustomGasPrice(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											setIsOpen(!isOpen)
										}
									}}
								/>
							</StyledLi>
							{GAS_SPEEDS.map((gasSpeed) => (
								<StyledLi
									key={gasSpeed}
									onClick={() => {
										setCustomGasPrice('');
										setGasSpeed(gasSpeed);
										setIsOpen(!isOpen);
									}}>
									<StyledSpeed>{gasSpeed}</StyledSpeed>
									<span>{Number(gasPrices[gasSpeed]).toFixed(2)}</span>
								</StyledLi>
							))}
						</StyledUl>
					}
				>
					<StyledEditButton
						type="button"
						onClick={()=> setIsOpen(!isOpen)}
					>
						Edit
					</StyledEditButton>
				</EditGasEstimateTooltip>
			</span>
		</StyledContainer>
	);
};

const StyledContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: 25px 0;
`;

const StyledGasDescription = styled.span`
	color: #5B5B5B;
	font-size: 14px;
`;

const StyledGasPrice = styled.span`
	font-size: 14px;
	margin: 0 10px;
`;

const StyledInput = styled.input`
	width: 120px;
	min-width: 0;
	font-family: Agrandir-Regular;
	background-color: #DBDBDB;
	height: 32px;
  padding: 0 8px;
	font-size: 14px;
	border: 0;
	border-radius: 4px;
	border: 1px solid #C4C4C4;
	color: #252626;
	caret-color: #477830;
	outline: none;
`;

const EditGasEstimateTooltip = styled(Tooltip)`
	background-color: ${(props) => props.theme.colors.background};

	> div {
		padding: 0 !important;
	}
`;

const StyledUl = styled.ul`
	padding: 0;
`;

const StyledLi = styled.li`
	list-style-type: none;
	padding: 15px;
	color: ${(props) => props.theme.colors.black};
	cursor: pointer;
	letter-spacing: 1px;
	font-weight: 300;
	text-align: left;
	display: flex;
	justify-content: space-between;

	&:hover {
		color: ${(props) => props.theme.colors.white};
		background-color: ${(props) => props.theme.colors.headerGreen};

		&:last-child {
			border-bottom-left-radius: 4px;
			border-bottom-right-radius: 4px;
		}
	}

	&:first-child {
		&:hover {
			background-color: inherit;
		}
		border-top: none;
	}
`;

const StyledSpeed = styled.span`
	&::first-letter {
    text-transform: uppercase;
	}
`;

const StyledEditButton = styled.button`
	border: 0;
	border-radius: 4px;
	cursor: pointer;
	padding: 5px 15px;
	color: ${(props) => props.theme.colors.white};
	background-color: #5B5B5B;
`;

export { GasSelector }
export default GasSelector;
